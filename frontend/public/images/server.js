const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const PORT = 3001;
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            serveFile(res, './index.html', 'text/html');
        }
        else if (req.url === '/about') {
            serveFile(res, './about.html', 'text/html');
        }
        else if (req.url === '/dashboard') {
            serveFile(res, './userdashboard.html', 'text/html');
        }
        else if (req.url === '/menu') {
            serveFile(res, './menu.html', 'text/html');
        }
        else if (req.url === '/login') {
            fs.readFile(path.join(__dirname, './login.html'), 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error loading the login page');
                    return;
                }
                res.end(data);
                
            });
        } else if (req.url === '/register') {
            fs.readFile(path.join(__dirname, './signup.html'), 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error loading the signup page');
                    return;
                }
                const updatedData = data.replace('{{errorMessage}}', '');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(updatedData);
            });
        } else {
            const filePath = path.join(__dirname, req.url);
            const extname = path.extname(filePath);

            let contentType = 'text/plain';
            switch (extname) {
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
                case '.svg':
                    contentType = 'image/svg+xml';
                    break;
                case '.html':
                    contentType = 'text/html';
                    break;
                case '.js': 
                    contentType = 'application/javascript';
                    break;
                default:
                    contentType = 'application/octet-stream';
            }

            serveFile(res, filePath, contentType);
        }
    } else if (req.method === 'POST') {
        switch (req.url) {
            case '/login': {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', () => {
                    const { email, password } = querystring.parse(body); 
                    // Read users from users.json
                    fs.readFile(path.join(__dirname, 'users.json'), 'utf-8', (err, data) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error reading user data');
                            return;
                        }

                        const users = JSON.parse(data);
                        const user = users.find(u => u.email === email && u.password === password);

                        if (user) {
                            // Redirect to the dashboard if login is successful
                            res.writeHead(302, { 'Location': '/dashboard' });
                            res.end();
                        } else {
                            res.writeHead(302, { 'Location': '/register' });
                            res.end();
                        }
                    });
                });
                break;
            }
            case '/register': {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', () => {
                    const { email, password } = querystring.parse(body);
                    const newUser = { email, password };

                    // Read existing users
                    fs.readFile(path.join(__dirname, 'users.json'), 'utf-8', (err, data) => {
                        let users = [];
                        if (!err && data.trim()) {
                            try {
                                users = JSON.parse(data);
                            } catch (parseErr) {
                                console.error('Error parsing users.json:', parseErr);
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Error reading user data.');
                                return;
                            }
                        }

                        // Check if the email already exists
                        const userExists = users.some(user => user.email === email);

                        if (userExists) {
                            // If the email already exists, send an error message
                            fs.readFile(path.join(__dirname, '/signup.html'), 'utf-8', (err, data) => {
                                if (err) {
                                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                                    res.end('Error loading the signup page');
                                    return;
                                }
                                const updatedData = data.replace('{{errorMessage}}', '<p style="color:red;">User Already Exists.Please Choose different Email id.</p>');
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.end(updatedData);
                            });
                            return;
                        }

                        // Add new user and save to users.json
                        users.push(newUser);
                        fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), err => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Error saving registration data');
                                return;
                            }
                            // Redirect to login page after successful registration
                            res.writeHead(302, { 'Location': '/login' });
                            res.end();
                        });
                    });
                });
                break;
            }
            default: {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        }
    }
});

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

server.listen(PORT,() => {
    console.log(`Server running at http://localhost:${PORT}`);
});

