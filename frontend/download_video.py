import urllib.request
import os

urls = [
    "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-swirling-background-4054-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-2514-large.mp4",
    "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
]

output_path = "c:\\Users\\hp\\.gemini\\antigravity\\scratch\\CineVerse\\frontend\\src\\assets\\videos\\hero-bg.mp4"

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
}

for url in urls:
    try:
        print(f"Trying to download: {url}")
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req) as response:
            with open(output_path, 'wb') as out_file:
                out_file.write(response.read())
        print(f"Successfully downloaded to {output_path}")
        break
    except Exception as e:
        print(f"Failed: {e}")
