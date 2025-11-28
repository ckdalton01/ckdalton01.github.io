+++
date = '2025-02-21T11:22:26-07:00'
draft = true
title = 'SQL Query For WSUS Updates'
tags = ['ConfigMgr','WSUS','Windows']
+++

## WSUS SQL Cleanup & Update Health Query

When working with WSUS—especially in large ConfigMgr/SCCM environments—database bloat and superseded updates can cause synchronization failures, ADR issues, and overall sluggish console performance. Administrators often need deeper visibility into the WSUS database to understand:

- How many updates are currently stored  
- Which updates are superseded  
- Whether superseded updates have been properly declined  
- Whether WSUS has accumulated a backlog of *obsolete* updates that require cleanup  
- Whether a specific update is declined in WSUS (useful for ConfigMgr troubleshooting)

The following SQL query is commonly used when troubleshooting WSUS optimization issues, ADR failures, and Patch Tuesday cleanup workflows.

---

### Why You Would Use This Query

This query provides a quick snapshot of WSUS update health, helping you answer:

- *Why is WSUS slow?*  
- *Why are ADR deployments failing?*  
- *Do I need to run Server Cleanup?*  
- *Why does ConfigMgr show mismatched update states?*

It reports:

- Total updates in WSUS  
- Superseded vs. active updates  
- Superseded updates that still need to be declined  
- Obsolete updates that WSUS cleanup should delete  
- Whether a specific update is declined in WSUS

---

## WSUS Cleanup Health Check Query

```sql
USE SUSDB;

DECLARE @numberOfMatch INT  
DECLARE @tmpTable TABLE (  
    name VARCHAR(25)  
)  

INSERT INTO @tmpTable  
EXEC spGetObsoleteUpdatesToCleanup  

SELECT @numberOfMatch = @@ROWCOUNT  

SELECT  
    (SELECT COUNT(*) FROM vwMinimalUpdate) AS 'Total Updates',  
    (SELECT COUNT(*) FROM vwMinimalUpdate WHERE declined = 0) AS 'Live Updates',  
    (SELECT COUNT(*) FROM vwMinimalUpdate WHERE IsSuperseded = 1) AS 'Superseded',  
    (SELECT COUNT(*) FROM vwMinimalUpdate WHERE IsSuperseded = 1 AND declined = 0) AS 'Superseded but not declined',  
    (SELECT COUNT(*) FROM vwMinimalUpdate WHERE declined = 1) AS 'Declined',  
    (SELECT COUNT(*) FROM vwMinimalUpdate WHERE IsSuperseded = 1 AND declined = 1) AS 'Superseded & Declined',  
    (SELECT COUNT(*) FROM @tmpTable) AS 'Obsolete Updates Needed to be cleaned'
```

---
## Check if a Specific Update Is Declined in WSUS

Useful when ConfigMgr and WSUS show different states based on the UpdateID (UpdateID can be found in ConfigMgr or WSUS).

```sql
    SELECT *  
    FROM [SUSDB].[PUBLIC_VIEWS].[vUpdate]  
    WHERE UpdateID = '4859D51D-CE20-44DD-9028-53BDDD225E16';
```