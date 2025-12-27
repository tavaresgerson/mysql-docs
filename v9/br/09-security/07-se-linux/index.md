## 8.7 SELinux

8.7.1 Verificar se o SELinux está ativado

8.7.2 Alterar o modo SELinux

8.7.3 Políticas do servidor MySQL SELinux

8.7.4 Contexto de arquivo SELinux

8.7.5 Contexto de porta TCP SELinux

8.7.6 Solução de problemas com o SELinux

O Linux com Enriquecimento de Segurança (SELinux) é um sistema de controle de acesso obrigatório (MAC) que implementa direitos de acesso aplicando uma etiqueta de segurança referida como um *contexto SELinux* a cada objeto do sistema. Os módulos de políticas SELinux usam contextos SELinux para definir regras sobre como processos, arquivos, portas e outros objetos do sistema interagem entre si. A interação entre objetos do sistema só é permitida se uma regra de política permitir.

Um contexto SELinux (a etiqueta aplicada a um objeto do sistema) tem os seguintes campos: `user`, `role`, `type` e `security level`. A informação de tipo, em vez do contexto SELinux completo, é comumente usada para definir regras sobre como os processos interagem com outros objetos do sistema. Os módulos de políticas MySQL SELinux, por exemplo, definem regras de política usando informações de `type`.

Você pode visualizar os contextos SELinux usando comandos do sistema operacional, como **ls** e **ps** com a opção `-Z`. Supondo que o SELinux esteja ativado e um servidor MySQL esteja em execução, os seguintes comandos mostram o contexto SELinux para o processo **mysqld** e o diretório de dados do MySQL:

**Processo mysqld:**

```
$> ps -eZ | grep mysqld
system_u:system_r:mysqld_t:s0    5924 ?        00:00:03 mysqld
```

Diretório de dados do MySQL:

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

* `mysqld_db_t` é o tipo associado ao diretório de dados do MySQL e seus arquivos.

* `s0` é o nível de segurança.

Para obter mais informações sobre a interpretação dos contextos SELinux, consulte a documentação do SELinux da sua distribuição.