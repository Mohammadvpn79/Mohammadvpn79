#!/bin/bash
echo "🚀 Starting Advanced IP Scanner..."

# دانلود از چند منبع قوی
curl -s "https://api.proxyscrape.com/v4/free-proxy-list/get?request=displayproxies&protocol=all&timeout=10000&limit=300" -o list1.txt 2>/dev/null
curl -s https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt -o list2.txt 2>/dev/null
curl -s https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt -o list3.txt 2>/dev/null

cat list*.txt 2>/dev/null | sed '/^$/d' | sort -u > all_ips.txt
rm -f list*.txt

HEALTHY="healthy_ips.txt"
BEST="best_lowping_ips.txt"
> "$HEALTHY"
> "$BEST"

echo "🔍 Testing IPs for health and low ping..."

while read -r ip; do
    if [ -n "$ip" ]; then
        # تست سلامت + اندازه‌گیری پینگ
        response=$(curl -s -x "http://$ip" --max-time 8 --connect-timeout 5 -w "%{time_total}" "https://api.ipify.org" 2>/dev/null)
        status=$?
        
        if [ $status -eq 0 ]; then
            echo "$ip" >> "$HEALTHY"
            echo "✅ Healthy: $ip"
            
            # تست پینگ برای بهترین‌ها
            ping_time=$(echo "$response" | tail -1)
            if (( $(echo "$ping_time < 2.5" | bc -l 2>/dev/null || echo 0) )); then
                echo "$ip | ${ping_time}s" >> "$BEST"
                echo "⭐ Low Ping Best: \( ip ( \){ping_time}s)"
            fi
        else
            echo "❌ Dead: $ip"
        fi
    fi
done < all_ips.txt

echo ""
echo "=================================="
echo "📊 Total Healthy IPs : $(wc -l < "$HEALTHY")"
echo "⭐ Best Low Ping IPs : $(wc -l < "$BEST")"
echo "=================================="

if [ -s "$BEST" ]; then
    sort -k3 -n "$BEST" -o "$BEST"
    echo "🏆 Top 15 Best Low Ping IPs:"
    head -15 "$BEST"
else
    echo "❌ No low ping IPs found."
    echo "Healthy IPs saved in $HEALTHY"
fi

echo ""
echo "📋 Copy Best IPs:"
echo "cat $BEST | cut -d' ' -f1 | termux-clipboard-set && echo '✅ Copied!'"
