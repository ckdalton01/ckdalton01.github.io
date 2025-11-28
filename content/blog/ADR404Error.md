+++
date = '2025-11-20T10:51:30-07:00'
draft = false
title = 'Configuration Manager ADR 0x87d20417 Helper Script'
tags = ['ConfigMgr','PatchMyPC','ADR','Windows']
+++

# 404 Error – .cab File Missing

Occasionally this error appears when attempting to deploy updates:

![image](/Pasted%20image%2020251120194954.png)

This is usually the result of a **missing .cab file**.

For more details, Patch My PC provides an overview of the issue:  
<https://patchmypc.com/kb/adr-error-0x87d20417/>

To resolve the problem manually, follow the steps here:  
<https://patchmypc.com/kb/missing-cab-update/>

## Automated Fix Script

While this script does not "Fix" the problem for you. You can use it to help you determine which updates are missing.
You can also use this script to automatically detect the missing .cab files. 
<https://github.com/ckdalton01/PMPC404Updates/>

![image](/Pasted%20image%2020251120195426.png)

This tool even identifies failures **without** requiring a Patch My PC subscription:

![image](/Pasted%20image%2020251120195650.png)