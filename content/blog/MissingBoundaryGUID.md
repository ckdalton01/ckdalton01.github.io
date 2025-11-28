+++
date = '2025-08-20'
draft = true
title = 'Troubleshooting Boundary Group and Content Lookup Issues in ConfigMgr'
tags = ['ConfigMgr','Troubleshooting','BranchCache']
+++

I wanted to compare some of the notes from our session to what we observed on the working device we have logs for.  
Again, all of this is **out of scope for PMPC**, but we can still provide insight into *where* to look.

While we reviewed a lot of things in the logs, the line that stood out the most was this:

![Log snippet](/Pasted%20image%2020250825090432.png)

This update was **Wireshark**. We confirmed it was properly signed and trusted by the device — but ultimately, the device **could not find the content**.

---

## Comparing to a Working Device

This is the *working* device installing a different update (Zoom), but it also reports that it cannot find its content:

![Working device log](/Pasted%20image%2020250825090441.png)

However, the update eventually **just appears**.  
There is no indication that the SCCM client successfully downloaded it — it suddenly reports the download as complete.

It appears **BranchCache** is delivering the content:

![BranchCache activity](/Pasted%20image%2020250825090451.png)

According to the SCCM client, it was searching for the content, and then it simply arrives in **0 seconds**.

This strongly suggests an issue with:

- Boundary Groups  
- Communication with IIS  
- DP assignment / content location lookup  

---

## Missing BoundaryGroupGUID

We reviewed this command:

![PowerShell command output](/Pasted%20image%2020250825090459.png)

The output was the same on both the test machine and LTS03:  
**BoundaryGroupGUIDs was missing.**

For comparison, here is what this should look like. Even my co-managed lab device has this populated:

![Lab device boundary info](/Pasted%20image%2020250825090510.png)

You can also see the issue reflected clearly in **locationservices.log**:

![locationservices.log](/Pasted%20image%2020250825090527.png)

This Reddit post discusses identical symptoms:  
<https://www.reddit.com/r/SCCM/comments/oxawm3/all_boundary_groups_missing_groupguid/>

I was unable to reproduce a scenario where the BoundaryGroup **GroupID** had data but the **GroupGUID** was blank.  
If I removed my device from all boundaries, I saw *no* information here:

![No boundary data](/Pasted%20image%2020250825090537.png)

---

## Possible Root Cause

In the end:

- The VPN may be blocking BranchCache traffic.  
- This could be why the on-prem device eventually installs updates — it receives cached content.  
- But the primary issue appears to be **broken or missing boundary group assignments**.

BranchCache is essentially “saving” the process by delivering the updates once they exist somewhere on the network.

Because of this, I strongly recommend **opening a support case with Microsoft**.

---

## Suggested Quick Test

A simple test would be:

1. Move the device into a **new boundary** or boundary group.  
2. Restart the `SMSAgent` service.  
3. Attempt to download content again.  
4. Review **locationservices.log**, specifically the `WSUSLocationRequest` entries.  

If the GUID populates properly, that will confirm the boundary group metadata was not updating.

---

## Double Policies

Regarding the double policies issue:

![Double policies](/Pasted%20image%2020250825090547.png)

I was able to reproduce this in the lab.  
The device does pick up both policies but **uses the highest priority**.

I do **not** believe this is the root cause of your issue.

---

00016311
