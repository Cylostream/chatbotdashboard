# Admin Dashboard Wireframes

This document contains wireframes for the Admin Dashboard of the Customizable Multi-Client Chat Widget Platform. These wireframes illustrate the main admin flows: managing clients, widgets, analytics, and alerts.

---

## 1. Dashboard Home
**Overview of all clients and widgets, quick stats, and alerts.**

```
+-------------------------------------------------------------+
| Sidebar      | Top Bar (Profile, Notifications)             |
|--------------+----------------------------------------------|
| [Clients]    |  [Global Stats: Total Clients, Widgets, Chats]|
| [Widgets]    |                                              |
| [Analytics]  |  [Webhook Alert: Widget X webhook failed!]   |
| [Alerts]     |                                              |
| [Settings]   |                                              |
|              |                                              |
|--------------+----------------------------------------------|
| Main Area:                                           [Add Client] [Create Demo Widget] [Bulk Delete] |
|  -------------------------------------------------------------  |
|  | Client Name | Widgets | Last Active | Actions (View/Edit) |  |
|  |-----------------------------------------------------------|  |
|  | Acme Corp   | 2       | 2024-06-01  | [View] [Edit]       |  |
|  | Beta Ltd    | 1       | 2024-06-02  | [View] [Edit]       |  |
|  -------------------------------------------------------------  |
+-------------------------------------------------------------+
```

*Note: The 'Bulk Delete' button allows the admin to select and delete multiple widgets, chat logs, or demo widgets at once.*

---

## 1a. Demo Widget Flow
**Easily share a live demo widget with a client.**

```
+------------------- Demo Widget Created ---------------------+
| Demo widget is ready!                                      |
|------------------------------------------------------------|
| Share this link with your client:                          |
| [https://yourdomain.com/demo/abc123_____________________] [Copy] |
|                                                            |
| [Open Demo Widget]                                         |
+------------------------------------------------------------+
```

*Note: The admin can copy and send this link to the client. The client can immediately chat with the demo widget in a live environment, no login required.*

---

## 2. Client Details
**Manage a specific client and their widgets.**

```
+------------------- Client: Acme Corp ----------------------+
| [Back to Clients]                                          |
| Name: Acme Corp      | Contact: jane@acme.com              |
| Company: Acme Inc.   |                                    |
|------------------------------------------------------------|
| [Add Widget] [Bulk Delete Widgets]                         |
|------------------------------------------------------------|
| Widget Name | Status  | Chats | Last Active | Actions      |
|------------------------------------------------------------|
| MainBot     | Active  | 120   | 2024-06-02  | [Edit] [Analytics] [Test Webhook] |
| SupportBot  | Inactive| 0     | -           | [Edit] [Analytics] [Test Webhook] |
+------------------------------------------------------------+
```

*Note: The 'Bulk Delete Widgets' button allows the admin to select and delete multiple widgets for this client.*

---

## 3. Widget Config/Edit
**Configure widget settings, branding, webhook, and test integration. Includes a live preview of the widget.**

```
+------------------- Edit Widget: MainBot -------------------+
| Name: [MainBot__________]   [Active]                       |
| Branding:                                                 |
|   Logo: [Upload]   Color: [#123456]   Welcome: [Hi there!] |
| Personality: [Friendly, Professional, etc.]                |
| First Message: [Hi! How can I help you today?]             |
| Webhook URL: [https://n8n.../webhook/abc123__________]     |
| [Test Webhook]  Status: [✓ Success]                        |
| Widget Secret: [************] [Copy]                       |
|------------------------------------------------------------|
| [Save] [Cancel]                                            |
|------------------------------------------------------------|
| Live Preview:                                              |
| +-------------------------------------+                    |
| | [Logo] Welcome to MainBot!          |                    |
| |-------------------------------------|                    |
| | User: Hi!                           |                    |
| | Bot:  Hello! How can I help you?    |                    |
| |-------------------------------------|                    |
| | [Type your message...] [Send]       |                    |
| | [👍] [👎]                            |                    |
| | Powered by [Your Brand]             |                    |
| |                                     |                    |
| | [Error: Sorry, our bot is temporarily unavailable. Please try again later.] |
| +-------------------------------------+                    |
+------------------------------------------------------------+
```

*Note: The live preview updates in real time as branding, personality, and settings are changed, allowing the admin to see exactly how the widget will appear to end users. If n8n is down, a user-friendly error message is shown in the preview.*

---

## 4. Analytics View
**Show analytics for a widget or client.**

```
+------------------- Widget Analytics: MainBot --------------+
| [Back to Widget]   Date Range: [Last 30 days ▼]            |
|------------------------------------------------------------|
| Chats: 120 | Avg. Confidence: 0.87 | 👍 80 | 👎 10          |
|------------------------------------------------------------|
| [Line Chart: Chats Over Time]                              |
| [Bar Chart: Confidence Score]                              |
| [Pie Chart: Feedback]                                      |
|------------------------------------------------------------|
| Most Common Questions:                                     |
| 1. How do I log in? (30)                                   |
| 2. What is my balance? (15)                                |
| ...                                                        |
+------------------------------------------------------------+
```

---

## 5. Alerts/Errors
**Show webhook errors and system alerts.**

```
+------------------- Webhook Alerts -------------------------+
| [Filter: All Widgets ▼]                                    |
|------------------------------------------------------------|
| Widget   | Error Type | Time        | Message              |
|------------------------------------------------------------|
| MainBot  | Timeout    | 2024-06-02  | No response in 5s    |
| Support  | 500 Error  | 2024-06-01  | Internal server err. |
|------------------------------------------------------------|
| [Mark All as Resolved]                                     |
+------------------------------------------------------------+
``` 