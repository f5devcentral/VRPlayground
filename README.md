# VRPlayground — Vulnerability Research Playground

**Next-gen, Swagger-driven, polyglot labs for modern AppSec training & research.**  
Run intentionally vulnerable microservices (Python, Node.js, Java, Ruby, PHP) behind a UI that **auto-generates from OpenAPI**. Add or modify a lab by editing `swagger.yaml`—the UI updates itself.

> ⚠️ **Security Warning:** This platform contains intentionally vulnerable code. Use only in isolated environments you control. Do **not** expose publicly.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-green.svg)](https://swagger.io/specification/)

![VRPlayground Logo](https://raw.githubusercontent.com/f5devcentral/VRPlayground/main/res/img/screenshot.png)

---

## 🎯 What is VRPlayground?

VRPlayground is a **spec-first microservices platform** where each service showcases **language-specific vulnerability classes** side-by-side. Document an endpoint once in OpenAPI, and the frontend renders inputs, examples, and responses automatically—making it simple to:

- **Security Researchers:** Compare the same vulnerability across different languages and frameworks
- **Security Trainers:** Create focused, isolated labs for specific attack vectors
- **Developers:** Learn language-specific security pitfalls in their preferred ecosystem
- **Penetration Testers:** Practice techniques in realistic, polyglot environments

### 🚀 Key Innovation: Spec-Driven UI

Document an endpoint once in OpenAPI, and the frontend automatically renders:
- Interactive input forms
- Pre-filled examples
- Response visualization
- Vulnerability explanations

This means **zero frontend development** when adding new labs—just describe your API and the UI updates itself.

---

## ✨ Features

### 🔧 **Technical Features**
- **Polyglot by design:** Python, Node.js, Java, Ruby, PHP (easily extensible)
- **Spec-driven UI:** Auto-generates from `frontend/public/swagger.yaml`
- **Microservices architecture:** Isolated, scalable, language-agnostic
- **Docker-native:** One-command deployment with `docker compose`

### 🎓 **Educational Features**
- **Focused labs:** Single-purpose endpoints for clear learning objectives
- **Language comparison:** Same vulnerability, different implementations
- **Real-world scenarios:** Practical examples beyond basic tutorials
- **Extensible platform:** Add new languages/services without touching the UI

---

## Included Labs (highlights)

- **Python:** SQLi (union/error/boolean/blind), XSS (tag/link/event/code), CSTI (AngularJS/Vue), SSTI (Jinja), Pickle deserialization  
- **Node.js:** NoSQLi (Mongo), Path Traversal, Command Injection, SSRF, Regex DoS  
- **Java:** Insecure Deserialization, XXE  
- **Ruby:** Marshal & YAML deserialization  
- **PHP:** Type Juggling, XXE  

See the full spec at **`/swagger.yaml`** and all routes under **`/api`**.

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/f5devcentral/VRPlayground
cd vrplayground-public

# Start all services
docker compose up -d

# Access the platform
open http://localhost
```

### Access Points
- **Main UI:** [http://localhost/](http://localhost/)
- **API Documentation:** [http://localhost/swagger.yaml](http://localhost/swagger.yaml)
- **API Endpoints:** [http://localhost/api/](http://localhost/api/)

### Service Architecture
| Service | Port | Purpose |
|---------|------|---------|
| `frontend` | 80 | Nginx proxy + auto-generated UI |
| `python-api` | 5000 | Python vulnerability labs |
| `nodejs-api` | 3000 | Node.js vulnerability labs |
| `java-api` | 8080 | Java vulnerability labs |
| `ruby-api` | 4567 | Ruby vulnerability labs |
| `php-api` | 80 | PHP vulnerability labs |
| `mariadb` | 3306 | MySQL-compatible database |
| `mongodb` | 27017 | NoSQL database |

---

## 🔧 Adding New Labs

VRPlayground's modular design makes it easy to add new vulnerability labs:

### 1. Create Your Service
```bash
mkdir my-language-api
# Add your vulnerable endpoints
```

### 2. Document in OpenAPI
```yaml
# Add to frontend/public/swagger.yaml
/my-language/vulnerability-type:
  post:
    tags: ["My Language", "Vulnerability Type"]
    description: "Description of the vulnerability"
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              input:
                type: string
                example: "malicious_input"
```
Groups can be added by using the 'summary' field for comparison.
```yaml
# Add the 'summary' field to group endpoints to compare vulnerabilities
/my-language/vulnerability-type:
  post:
    tags: ["My Language", "Vulnerability Type"]
    description: "Description of the vulnerability"
    summary: "tag1"
```

### 3. Wire into Docker Compose
```yaml
# Add to compose.yml
my-language-api:
  build: my-language-api
  expose:
    - "9000"
```

### 4. Update Nginx Proxy
```nginx
# Add to frontend/conf.d/default.conf
location /api/my-language/ {
    proxy_pass http://my-language-api:9000/;
}
```

The UI will automatically pick up your new endpoints from the OpenAPI spec!

---

## 🎯 Use Cases

### Security Training
- **Workshops:** Focused, isolated labs for specific attack vectors
- **Conferences:** Live demonstrations with real-time code changes
- **Corporate Training:** Language-specific security education

### Research & Development
- **Vulnerability Research:** Compare implementations across languages
- **Tool Development:** Test security tools against multiple platforms
- **Framework Analysis:** Understand language-specific security quirks

### Penetration Testing
- **Skill Development:** Practice techniques in realistic environments
- **Tool Validation:** Test tools against various technology stacks
- **Methodology Refinement:** Develop and test attack methodologies

---

## 👑 Contributors

The Project Leaders are:
* [Tomer Zait](https://github.com/realgam3) aka realgam3
* [Dimitri Belski](https://www.linkedin.com/in/dima-belski)

## 🤝 Contributing

We welcome contributions! VRPlayground is designed to be community-driven:

1. **Add new languages:** Create services in your preferred language
2. **Enhance existing labs:** Improve vulnerability implementations
3. **Documentation:** Help improve guides and examples
4. **UI improvements:** Enhance the auto-generated interface

### Development Guidelines
- Keep labs **intentionally vulnerable** but **well-documented**
- Follow the existing OpenAPI specification format
- Ensure Docker compatibility
- Add comprehensive examples and explanations

---

## 📄 License

**Apache 2.0** - See [LICENSE](LICENSE) file for details.
