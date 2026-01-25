### 6.7.2 Alterando o Modo SELinux

O SELinux suporta os *modes* *enforcing*, *permissive* e *disabled*. O *mode enforcing* é o padrão. O *mode permissive* permite operações que não são permitidas no *mode enforcing* e as registra no *audit log* do SELinux. O *mode permissive* é tipicamente usado ao desenvolver *policies* ou para *troubleshooting*. No *mode disabled*, as *policies* não são impostas, e os *contexts* não são aplicados a objetos do sistema, o que dificulta a habilitação do SELinux posteriormente.

Para visualizar o *mode* SELinux atual, use o *command* **sestatus** mencionado anteriormente ou o *utility* **getenforce**.

```sql
$> getenforce
Enforcing
```

Para alterar o *mode* SELinux, use o *utility* `setenforce`:

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

As alterações feitas com **setenforce** são perdidas ao reiniciar o sistema. Para alterar permanentemente o *mode* SELinux, edite o arquivo `/etc/selinux/config` e reinicie o sistema.