### 7.9.1 Debugging de um servidor MySQL

Se você estiver usando alguma funcionalidade que é muito nova no MySQL, você pode tentar executar `mysqld` com a opção `--skip-new` (que desativa todas as funcionalidades novas, potencialmente inseguras). Veja Seção B.3.3.3, "O que fazer se o MySQL continuar a falhar".

Se `mysqld` não quiser iniciar, verifique se você não tem arquivos `my.cnf` que interfiram com sua configuração! Você pode verificar seus argumentos `my.cnf` com **mysqld --print-defaults** e evitar usá-los começando com **mysqld --no-defaults ...**.

Se `mysqld` começa a consumir CPU ou memória ou se hangs, você pode usar **mysqladmin processlist status** para descobrir se alguém está executando uma consulta que leva muito tempo. Pode ser uma boa ideia executar **mysqladmin -i10 processlist status** em alguma janela se você estiver enfrentando problemas de desempenho ou problemas quando novos clientes não podem se conectar.

O comando **mysqladmin debug** despeja algumas informações sobre bloqueios em uso, memória usada e uso de consulta para o arquivo de log do MySQL. Isso pode ajudar a resolver alguns problemas. Este comando também fornece algumas informações úteis, mesmo que você não tenha compilado o MySQL para depuração!

Se o problema é que algumas tabelas estão ficando cada vez mais lentas, você deve tentar otimizar a tabela com `OPTIMIZE TABLE` ou `myisamchk`. Veja o Capítulo 7, *Administração do Servidor MySQL*. Você também deve verificar as consultas lentas com `EXPLAIN`.

Leia também a secção específica do sistema operativo deste manual para problemas que possam ser exclusivos do seu ambiente. Ver Secção 2.1, "Instruções gerais de instalação".
