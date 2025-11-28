+++
date = '2024-12-20'
draft = false
title = 'Configuration Manager Cloud Attach Error: (401) Unauthorized'
tags = ['ConfigMgr','Intune','CloudAttach','Troubleshooting']
+++

# ConfigMgr Cloud Attach Error: (401) Unauthorized  
**CMGatewayNotificationWorker**

```
[Warning][CMGatewayNotificationWorker][0][System.Net.WebException][0x80131509]
The remote server returned an error: (401) Unauthorized.
at Microsoft.ConfigurationManager.ServiceConnector.ExtensionMethods.d__13.MoveNext()
```

I struggled with this one while setting up Co-management testing in Microsoft Configuration Manager.  
Cloud Attach completed successfully — everything looked good. I entered my Entra ID Global Admin credentials and all indicators turned green.

**But nothing would sync.**

After reviewing the logs, I found the following repeated error in **CMGatewayNotificationWorker.log**:

![CMGatewayNotificationWorker 401 error](/image.png)

This looked odd, so I followed the connection trail into Azure.

## Checking the Enterprise Application in Azure

The Enterprise Application created during Cloud Attach was visible in Azure:

![Enterprise application view](/image-3.webp)

Because this connection relies on Azure permissions — and we were getting an **Unauthorized (401)** — I reviewed:

**Security → Permissions → Grant admin consent**

![Grant admin consent](/image-1.webp)

After granting consent, the logs immediately improved:

![Log showing 204 NoContent](/image-4.png)

Now we were seeing `204 (NoContent)` instead of 401 errors — a very good sign.

## Sync Restored

About 10 minutes later, the connection under:

**Tenant Administration → Connectors and tokens → Microsoft Endpoint Configuration Manager**

turned **Healthy**.

![Connector healthy](/image-2.webp)

And shortly after, the device appeared properly in Intune:

![Device in Intune](/image-5.webp)

---

Cheers.
