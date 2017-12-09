ip="$(ifconfig | grep -v 'en0:' | grep -A 1 'en0' | tail -1 | cut -d ' ' -f 2)"
export IP=$ip
