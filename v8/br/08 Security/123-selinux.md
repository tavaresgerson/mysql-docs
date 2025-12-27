## 8.7 SELinux

O Linux com Controle de Acesso Aprimorado (SELinux) é um sistema de controle de acesso obrigatório (MAC) que implementa direitos de acesso aplicando uma etiqueta de segurança conhecida como *contexto SELinux* a cada objeto do sistema. Os módulos de políticas SELinux usam contextos SELinux para definir regras sobre como processos, arquivos, portas e outros objetos do sistema interagem uns com os outros. A interação entre objetos do sistema só é permitida se uma regra de política permitir.

Um contexto SELinux (a etiqueta aplicada a um objeto do sistema) tem os seguintes campos: `user`, `role`, `type` e `security level`. A informação de tipo, em vez do contexto SELinux completo, é comumente usada para definir regras sobre como os processos interagem com outros objetos do sistema. Os módulos de políticas SELinux MySQL, por exemplo, definem regras de política usando informações de `type`.

Você pode visualizar os contextos SELinux usando comandos do sistema operacional, como `ls` e `ps`, com a opção `-Z`. Supondo que o SELinux esteja habilitado e um servidor MySQL esteja em execução, os seguintes comandos mostram o contexto SELinux para o processo `mysqld` e o diretório de dados do MySQL:

 Processo `mysqld`:

```
$> ps -eZ | grep mysqld
system_u:system_r:mysqld_t:s0    5924 ?        00:00:03 mysqld
```

Diretório de dados MySQL:

```
$> cd /var/lib
$> ls -Z | grep mysql
system_u:object_r:mysqld_db_t:s0 mysql
```

onde:

* `system_u` é uma identidade de usuário SELinux para processos e objetos do sistema.
* `system_r` é um papel SELinux usado para processos do sistema.
* `objects_r` é um papel SELinux usado para objetos do sistema.
* `mysqld_t` é o tipo associado ao processo mysqld.
* `mysqld_db_t` é o tipo associado ao diretório de dados MySQL e seus arquivos.
* `s0` é o nível de segurança.

Para obter mais informações sobre a interpretação de contextos SELinux, consulte a documentação do SELinux da sua distribuição.