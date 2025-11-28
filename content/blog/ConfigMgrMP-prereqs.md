+++
date = '2023-11-14T16:11:42-07:00'
draft = false
title = 'Configuration Manager MP PowerShell Prereqs'
tags = ['ConfigMgr']
+++

## Why Use PowerShell to Install Prerequisites for a Configuration Manager Management Point?

When building a **Configuration Manager (SCCM) Management Point**, installing the correct Windows Server prerequisites is critical. While these components can be added manually through Server Manager, using **PowerShell** is the fastest, most reliable, and most repeatable way to prepare a server for the MP role.

PowerShell ensures:

- **Consistency** – Every server is built the same way, reducing configuration drift.  
- **Speed** – A full MP prereq stack installs in seconds, not minutes.  
- **Automation** – Ideal for large environments, rebuilds, labs, and standardized deployment pipelines.  
- **Documentation** – The installation script becomes living documentation of what's required.  
- **Error reduction** – Avoid missing components that cause MP install failures.

Below is a complete PowerShell command set you can use to install all MP prerequisites in one shot.

### PowerShell Prerequisites for SCCM Management Point

```powershell
# All Pre-reqs for MP:
Install-WindowsFeature -Name NET-Framework-Features
Install-WindowsFeature -Name NET-Framework-Core
Install-WindowsFeature -Name NET-Framework-45-Features
Install-WindowsFeature -Name NET-Framework-45-Core
Install-WindowsFeature -Name NET-Framework-45-ASPNET
Install-WindowsFeature -Name NET-WCF-Services45
Install-WindowsFeature -Name NET-WCF-HTTP-Activation45
Install-WindowsFeature -Name NET-WCF-TCP-PortSharing45
Install-WindowsFeature -Name Web-Server -IncludeManagementTools
Install-WindowsFeature -Name Web-WebServer
Install-WindowsFeature -Name Web-ISAPI-Ext
Install-WindowsFeature -Name Web-Windows-Auth
Install-WindowsFeature -Name Web-Mgmt-Tools
Install-WindowsFeature -Name Web-Mgmt-Console
Install-WindowsFeature -Name Web-Mgmt-Compat
Install-WindowsFeature -Name Web-Metabase
Install-WindowsFeature -Name Web-WMI
Install-WindowsFeature -Name BITS
Install-WindowsFeature -Name BITS-IIS-Ext
