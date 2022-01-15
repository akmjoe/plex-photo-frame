# Plex Photo Frame
Alternative implementation for photo slideshow from playlist in Plex Media Server
Uses Node.js proxy for CORS because Plex does not provide the correct Access-Control-Allow-Origin header
when accessed by direct ip.

## Instalation
1. Clone the repository
2. Edit `plexPathRoot` in `config.js` to match your proxy server IP and port
3. Edit `plexPathRoot` in `proxy/config.js` to match your plex server IP and port
4. Go to `Settings > Server > Network > List of IP addresses and networks that are allowed without auth` in plex,
add the IP address of the proxy server.
5. Start the proxy server: `node proxy/cors-proxy-server.js`
6. Deploy on on any HTTP server
7. Open browser and type the address of this server
8. Enjoy!

## Other settings
If you don't need the proxy, you can point `plexPathRoot` in `config.js` to match your plex server IP and port
You can edit `port` in `proxy/config.js` to to change the proxy server port
The proxy server allows trafic from anywhere, so you will need to set up a firewall to only allow
access from your local network.

## Downloading playlists
If the proxy server is running on the same system as Plex, you can use the Download Playlist section to download
all the files from the playlist as a TAR. This will only work if your system uses the `tar` command.
This also works for audio playlists.

## Set proxy to Auto-run (linux)
Set the proxy server to be run as a service:
`sudo nano /lib/systemd/system/plex-proxy.service`
And enter this content in the file:
`[Unit]
Description=CORS proxy server for Plex local
Documentation=none
After=network.target

[Service]
Type=simple
User=www-data
ExecStart=/usr/bin/node /var/www/plex-photo-frame/proxy/cors-proxy-server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
`
Then reload systemctl:
`sudo systemctl daemon-reload`
Start proxy server:
`sudo systemctl start plex-proxy`
Make sure it is running:
`sudo systemctl status plex-proxy`

## Sample screenshot

![Photo frame](https://i.imgur.com/qf05Sm3.png)
