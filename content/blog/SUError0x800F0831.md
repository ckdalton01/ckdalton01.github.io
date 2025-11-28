+++
date = '2023-03-23'
draft = false
title = 'Configuration Manager Software Updates Error 0x800F0831'
tags = ['ConfigMgr','Windows','Troubleshooting','SoftwareUpdates']
+++

# Configuration Manager: Software Updates Error 0x800F0831

I came across this issue in Configuration Manager while attempting to patch a Server OS.

![Update failure screenshot](/image-5.png)

The error:

**Failed to Install Updates — 0x800F0831 (Unknown Error -2146498511)**  

occurs when a **pre-requisite update is missing** from the system.

To resolve this, we must identify and install the missing prerequisite.

Below is an example from one of my Windows Server 2012 systems where two monthly updates repeatedly failed to install — even after manual retries.

---

## Step 1: Identify the Failed Updates

Log on to the affected server and open **Software Center → Updates**.  
You will see the patches that failed.

---

## Step 2: Review the Log Files

To determine the missing prerequisite, check the following logs:

- `C:\Windows\windowsupdates.log`
- `C:\Windows\Logs\CBS\cbs.log`

Search the logs for the phrase:

**missing for package**

![CBS log example](/image-6.webp)

You can also search the **CBS.log** for the error:

**0x800F0831**

Review the lines immediately preceding the error — these usually point to the missing update.

---

## Step 3: Download and Install the Missing Update

Once identified:

1. Download the missing update from the Microsoft Update Catalog.  
2. Install it manually.  
3. Re-run Software Updates in Configuration Manager.

After applying the prerequisite, all remaining updates should install normally.

