### 8.7.2 Mudando o Modo SELinux

O SELinux suporta modos de aplicação, permissivo e desativado. O modo de aplicação é o padrão. O modo permissivo permite operações que não são permitidas no modo de aplicação e registra essas operações no log de auditoria do SELinux. O modo permissivo é tipicamente usado durante o desenvolvimento de políticas ou a solução de problemas. No modo desativado, as políticas não são aplicadas e os contextos não são aplicados aos objetos do sistema, o que dificulta a reativação do SELinux posteriormente.

Para visualizar o modo SELinux atual, use o comando `sestatus` mencionado anteriormente ou o utilitário `getenforce`.

```
$> getenforce
Enforcing
```

Para mudar o modo SELinux, use o utilitário `setenforce`:

```
$> setenforce 0
$> getenforce
Permissive
```

```
$> setenforce 1
$> getenforce
Enforcing
```

As alterações feitas com `setenforce` são perdidas ao reiniciar o sistema. Para alterar permanentemente o modo SELinux, edite o arquivo `/etc/selinux/config` e reinicie o sistema.