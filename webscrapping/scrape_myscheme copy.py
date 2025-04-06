import requests
from bs4 import BeautifulSoup
import time

# Step 1: Define sitemap URLs
sitemap_urls = [
    "https://myscheme.gov.in/sitemap-0.xml",
    "https://myscheme.gov.in/sitemap-1.xml"
]

# Step 2: Set headers to mimic a browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Step 3: Function to extract scheme URLs from a sitemap
def get_scheme_urls(sitemap_url):
    response = requests.get(sitemap_url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch {sitemap_url}. Status code: {response.status_code}")
        return []
    
    soup = BeautifulSoup(response.content, "xml")
    urls = [loc.text for loc in soup.find_all("loc") if "/schemes/" in loc.text]
    return urls

# Step 4: Function to scrape a scheme page
def scrape_scheme_page(url):
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch {url}. Status code: {response.status_code}")
        return {}
    
    soup = BeautifulSoup(response.content, "html.parser")
    scheme_data = {}
    
    # Extract scheme title (assuming it's in <h1> at the top of the page)
    title = soup.find("h1")
    scheme_data["Title"] = title.get_text(strip=True) if title else "Unknown Scheme"
    
    # Define sections to scrape based on their div IDs
    sections = {
        "details": "Details",
        "benefits": "Benefits",
        "eligibility": "Eligibility",
        "application-process": "Application Process",
        "documents-required": "Documents Required"
    }
    
    for section_id, section_name in sections.items():
        section_div = soup.find("div", id=section_id)
        if section_div:
            # Find the markdown-options div within the section
            markdown_div = section_div.find("div", class_="markdown-options")
            if markdown_div:
                content = []
                # Extract text from paragraphs
                for p in markdown_div.find_all("div", class_="mb-2"):
                    text = p.get_text(strip=True)
                    if text:
                        content.append(text)
                # Extract text from list items
                for ul in markdown_div.find_all("ul"):
                    items = [li.get_text(strip=True) for li in ul.find_all("li")]
                    content.extend(items)
                # Join content with newlines
                scheme_data[section_name] = "\n".join(content) if content else "Not found"
            else:
                scheme_data[section_name] = "Not found"
        else:
            scheme_data[section_name] = "Not found"
    
    return scheme_data

# Step 5: Main logic
all_scheme_urls = []
for sitemap in sitemap_urls:
    print(f"Fetching URLs from {sitemap}...")
    scheme_urls = get_scheme_urls(sitemap)
    all_scheme_urls.extend(scheme_urls)
    print(f"Found {len(scheme_urls)} scheme URLs in {sitemap}")

print(f"Total scheme URLs to scrape: {len(all_scheme_urls)}")

# Step 6: Scrape and save data
with open("schemes_detailed.txt", "w", encoding="utf-8") as file:
    for i, url in enumerate(all_scheme_urls, 1):
        print(f"Scraping {i}/{len(all_scheme_urls)}: {url}")
        scheme_data = scrape_scheme_page(url)
        
        # Write to file
        file.write(f"Scheme: {scheme_data.get('Title', 'N/A')}\n")
        file.write(f"URL: {url}\n")
        for section in ["Details", "Benefits", "Eligibility", "Application Process", "Documents Required"]:
            file.write(f"{section}:\n{scheme_data.get(section, 'Not found')}\n")
        file.write("-" * 80 + "\n\n")
        
        # Respectful delay
        time.sleep(2)

print("Scraping complete! Data saved to schemes_detailed.txt")