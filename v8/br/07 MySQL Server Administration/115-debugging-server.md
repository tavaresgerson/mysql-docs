### 7.9.1 Depuração de um Servidor MySQL

Se você estiver usando alguma funcionalidade muito nova no MySQL, tente executar o `mysqld` com a opção `--skip-new` (que desabilita todas as novas funcionalidades potencialmente inseguras). Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar travando”.

Se o `mysqld` não quiser iniciar, verifique se não há arquivos `my.cnf` que interfiram em sua configuração! Você pode verificar os argumentos do `my.cnf` com `mysqld --print-defaults` e evitar usá-los iniciando com `mysqld --no-defaults ...`.

Se o `mysqld` começar a consumir CPU ou memória ou se "travar", você pode usar `mysqladmin processlist status` para descobrir se alguém está executando uma consulta que leva muito tempo. Pode ser uma boa ideia executar `mysqladmin -i10 processlist status` em uma janela se você estiver enfrentando problemas de desempenho ou problemas quando novos clientes não conseguem se conectar.

O comando `mysqladmin debug` libera algumas informações sobre os bloqueios em uso, memória usada e uso de consultas no arquivo de log do MySQL. Isso pode ajudar a resolver alguns problemas. Esse comando também fornece informações úteis mesmo se você não compilou o MySQL para depuração!

Se o problema for que algumas tabelas estão ficando mais e mais lentas, você deve tentar otimizar a tabela com `OPTIMIZE TABLE` ou `myisamchk`. Veja o Capítulo 7, *Administração do Servidor MySQL*. Você também deve verificar as consultas lentas com `EXPLAIN`.

Você também deve ler a seção específica do sistema operacional neste manual para problemas que podem ser únicos ao seu ambiente. Veja a Seção 2.1, “Orientações Gerais de Instalação”.