+++
date = '2025-01-27T21:16:26-07:00'
draft = false
title = 'Patch My PC Update Rings'
tags = ['Intune','PatchMyPC']
+++

# Patch My PC Portal Update rings explained.

I don’t like the word “demystified” because it feels like some AI slop.

These patches that are released are not like Microsoft Updates where updates are released once a month on Patch Tuesday. They are released whenever the vendor sends out the update.

Update rings are based on a +(Days) from when the **VENDOR** releases the update.

I’m going to try and explain this visually.
![[image-101.png]](/image-101.png)

Updates from vendors can overlap. The rings will be held in the portal to ensure the groups are ‘stepped’ through.

If you are always adding +7 days (in Intune), the All Devices group may not ever see the “Update for %application%”

Sorry for the small text.

Documentation can be found here:
[https://docs.patchmypc.com/installation-guides/patch-my-pc-cloud/deployments/update-rings/update-rings-overview](https://docs.patchmypc.com/installation-guides/patch-my-pc-cloud/deployments/update-rings/update-rings-overview)