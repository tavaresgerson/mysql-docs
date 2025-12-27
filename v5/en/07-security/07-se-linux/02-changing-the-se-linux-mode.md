### 6.7.2 Changing the SELinux Mode

SELinux supports enforcing, permissive, and disabled modes. Enforcing mode is the default. Permissive mode allows operations that are not permitted in enforcing mode and logs those operations to the SELinux audit log. Permissive mode is typically used when developing policies or troubleshooting. In disabled mode, polices are not enforced, and contexts are not applied to system objects, which makes it difficult to enable SELinux later.

To view the current SELinux mode, use the **sestatus** command mentioned previously or the **getenforce** utility.

```sql
$> getenforce
Enforcing
```

To change the SELinux mode, use the `setenforce` utility:

```sql
$> setenforce 0
$> getenforce
Permissive
```

```sql
$> setenforce 1
$> getenforce
Enforcing
```

Changes made with **setenforce** are lost when you restart the system. To permanently change the SELinux mode, edit the `/etc/selinux/config` file and restart the system.
