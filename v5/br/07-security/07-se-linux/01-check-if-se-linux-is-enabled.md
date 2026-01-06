### 6.7.1 Verifique se o SELinux está ativado

O SELinux está habilitado por padrão em algumas distribuições Linux, incluindo o Oracle Linux, o RHEL, o CentOS e o Fedora. Use o comando **sestatus** para determinar se o SELinux está habilitado na sua distribuição:

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

Se o SELinux estiver desativado ou se o comando **sestatus** não for encontrado, consulte a documentação do SELinux da sua distribuição para obter orientações antes de ativar o SELinux.
