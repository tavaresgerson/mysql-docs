### 6.7.3 Políticas do MySQL Server SELinux

Os módulos de políticas do MySQL Server SELinux são instalados normalmente por padrão. Você pode visualizar os módulos instalados usando o comando **semodule -l**. Os módulos de políticas do MySQL Server SELinux incluem:

- `mysqld_selinux`
- `mysqld_safe_selinux`

Para obter informações sobre os módulos de políticas do MySQL Server SELinux, consulte as páginas do manual do SELinux. As páginas do manual fornecem informações sobre os tipos e os booleanos associados ao serviço MySQL. As páginas do manual são nomeadas no formato `service-name_selinux`.

```sh
man mysqld_selinux
```

Se as páginas do manual do SELinux não estiverem disponíveis, consulte a documentação do SELinux da sua distribuição para obter informações sobre como gerar páginas do manual usando o utilitário `sepolicy manpage`.
