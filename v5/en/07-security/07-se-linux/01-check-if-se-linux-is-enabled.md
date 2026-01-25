### 6.7.1 Verificar se o SELinux está Ativado

O SELinux é habilitado por padrão em algumas distribuições Linux, incluindo Oracle Linux, RHEL, CentOS e Fedora. Use o **sestatus** command para determinar se o SELinux está ativado em sua distribuição:

```sql
$> sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Memory protection checking:     actual (secure)
Max kernel policy version:      31
```

Se o SELinux estiver desabilitado ou se o **sestatus** command não for encontrado, consulte a documentação SELinux de sua distribuição para obter orientação antes de habilitar o SELinux.