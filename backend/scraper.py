import requests
from bs4 import BeautifulSoup
import time
import json
import sys

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
        return []
    soup = BeautifulSoup(response.content, "xml")
    return [loc.text for loc in soup.find_all("loc") if "/schemes/" in loc.text]

# Step 4: Function to scrape a scheme page
def scrape_scheme_page(url):
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return {}
    
    soup = BeautifulSoup(response.content, "html.parser")
    scheme_data = {}
    title = soup.find("h1")
    scheme_data["Title"] = title.get_text(strip=True) if title else "Unknown Scheme"

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
            markdown_div = section_div.find("div", class_="markdown-options")
            if markdown_div:
                content = []
                for p in markdown_div.find_all("div", class_="mb-2"):
                    text = p.get_text(strip=True)
                    if text:
                        content.append(text)
                for ul in markdown_div.find_all("ul"):
                    items = [li.get_text(strip=True) for li in ul.find_all("li")]
                    content.extend(items)
                scheme_data[section_name] = "\n".join(content) if content else "Not found"
            else:
                scheme_data[section_name] = "Not found"
        else:
            scheme_data[section_name] = "Not found"
    
    scheme_data["URL"] = url
    return scheme_data

# Step 5: Main logic
all_scheme_urls = []
for sitemap in sitemap_urls:
    all_scheme_urls.extend(get_scheme_urls(sitemap))

# Limit how many schemes to scrape (for speed)
limit = int(sys.argv[1]) if len(sys.argv) > 1 else 5
all_scheme_urls = all_scheme_urls[:limit]

results = []
for i, url in enumerate(all_scheme_urls, 1):
    results.append(scrape_scheme_page(url))
    time.sleep(1)  # respectful delay

# Output as JSON
print(json.dumps(results, ensure_ascii=False))
