# 🎮 Tournament Django Website

A comprehensive tournament management platform with advanced role-based access control, payment processing, and real-time credential management.

**Creator:** [MD Salehin](https://mdsalehin.netlify.app)

---

## ✨ Features

- **Multi-tier Admin System** with 5 distinct admin roles
- **Tournament Management** with custom room credentials
- **Payment Processing** with role-based access
- **Audit Logging** for all critical actions
- **Performance Optimized** with intelligent caching
- **Fully Responsive** custom UI design
- **Secure Authentication** with multiple login portals

---

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- PostgreSQL (optional, falls back to SQLite)

### Installation

1. **Set up virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your database URL (optional)
   ```

4. **Initialize database**
   ```bash
   python manage.py collectstatic
   python manage.py migrate
   python manage.py create_demo_data
   ```

5. **Run the server**
   ```bash
   # Development
   python manage.py runserver
   
   # Production
   gunicorn esports.wsgi
   ```

---

## 👥 Demo Accounts

The `create_demo_data` command creates the following test accounts:

| Username | Password    | Role            | Permissions                    |
|----------|-------------|-----------------|--------------------------------|
| super    | superpass   | SuperAdmin      | Full system access             |
| admin1   | adminpass   | Admin           | Tournament + Payment access    |
| admin2   | adminpass   | Admin (Npay)    | Admin management only          |
| player   | playerpass  | Player          | Standard user access           |

---

## 🔐 User Roles & Permissions

### 1. **SuperAdmin**
- Assign and remove admin privileges
- Access all admin functionalities
- Manage user permissions
- Full system control

### 2. **Admin**
- Access admin dashboard
- Manage tournaments
- Manage payments
- View audit logs

### 3. **Tournament-Admin**
- Tournament creation and management
- Credential distribution
- Tournament monitoring
- *No payment access*

### 4. **Payment-Admin**
- Payment processing
- Transaction management
- Payment verification
- *No tournament access*

### 5. **Special-Admin**
- Custom SuperAdmin-delegated tasks
- Temporary elevated privileges
- Assigned and revoked by SuperAdmin

### 6. **Admin (Npay Group)**
- Admin management access only
- Limited administrative functions

---

## 🗺️ URL Structure

### Public Routes
| Path | Description |
|------|-------------|
| `/` | Home page |
| `/signup/` | User registration |
| `/login/` | Player login |
| `/profile/` | User profile |
| `/tournament/<uuid:pk>/` | Tournament details |
| `/tournament/<uuid:pk>/join` | Join tournament |
| `/my/applications/` | User's tournament applications |

### Admin Routes
| Path | Description |
|------|-------------|
| `/auth_login/` | Admin & SuperAdmin login |
| `/admin_setup/dashboard/requests/` | View all requests |
| `/admin_setup/dashboard/request/<int:pk>/` | Request details |
| `/admin_setup/dashboard/tournaments/` | Tournament management |
| `/admin_setup/dashboard/tournaments/<uuid:pk>/credentials/` | Manage credentials |

### SuperAdmin Routes
| Path | Description |
|------|-------------|
| `/XHj28vGk9pLxZq2jR7mT_wF4yB_nU6sH_aD1eC_oV0iQ_f/` | SuperAdmin dashboard & login |

### Authentication
| Path | Description |
|------|-------------|
| `/logout/` | User logout |

---

## ⚙️ How It Works

### Tournament Flow

1. **Admin Creates Tournament**
   - Sets up tournament details
   - Optionally adds custom room ID and password

2. **Player Registration**
   - Users browse available tournaments
   - Request to Purchase tournament slots
   - Submit applications

3. **Credential Distribution**
   - Admins review applications and process Payment manually.
   - Update/provide credentials before tournament start
   - Players receive room details automatically

4. **Payment Processing**
   - Payment-Admins verify transactions manually.
   - Automated slot confirmation
   - Audit trail maintained

---

## 🎨 Architecture Highlights

### Frontend
- **Custom Responsive Design** - No external UI frameworks
- **Component-Based Structure** - Reusable navigation and footer
- **Dedicated CSS/JS** - Per-page optimization
- **Admin-Specific Styling** - Professional dashboard design

### Backend
- **Smart Caching** - Homepage tournament data cached (30-min TTL)
- **Database Optimization** - Reduced latency for frequent queries
- **Modular Authentication** - Three separate login portals
- **Audit Logging** - Comprehensive activity tracking

### Performance
- Tournament data cache refresh: **30 minutes** (configurable)
- Cache applies to: Home page only
- Credentials page: **Real-time** (no caching)

---

## 🔧 Configuration

### Database Setup

The application supports both PostgreSQL and SQLite:

```env
# .env file
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DJANGO_SECRET_KEY=complex_secret_key
```

If `DATABASE_URL` is not set, SQLite will be used by default.

### Cache Configuration

To modify cache duration, edit the cache timeout in your settings:

```python
# settings.py
CACHES = {
    'default': {
        'TIMEOUT': 1800,  # 30 minutes in seconds
    }
}
```

---

## 📝 Development Notes

- **Modular Templates** - Navigation and footer are separate components merged with base template
- **Easy Customization** - Component-based design allows effortless updates
- **Security First** - Role-based access control on all sensitive routes
- **Audit Trail** - All admin actions logged for accountability


---

## 👨‍💻 Creator

**MD Salehin**  
Portfolio: [mdsalehin.netlify.app](https://mdsalehin.netlify.app)

