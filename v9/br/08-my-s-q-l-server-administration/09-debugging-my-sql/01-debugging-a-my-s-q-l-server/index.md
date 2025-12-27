### 7.9.1 Depuração de um Servidor MySQL

7.9.1.1 Compilando o MySQL para Depuração

7.9.1.2 Criando Arquivos de Rastreamento

7.9.1.3 Usando o WER com o PDB para criar um crashdump do Windows

7.9.1.4 Depurando o mysqld no gdb

7.9.1.5 Usando uma Traça de Pilha

7.9.1.6 Usando Logs do Servidor para Encontrar Causas de Erros no mysqld

7.9.1.7 Criando um Caso de Teste Se Você Experimenta Corrupção de Tabelas

Se você está usando alguma funcionalidade muito nova no MySQL, você pode tentar executar o **mysqld** com a opção `--skip-new` (que desabilita todas as novas funcionalidades potencialmente inseguras). Veja a Seção B.3.3.3, “O que Fazer Se o MySQL Continuar a Quebrar”.

Se o **mysqld** não quiser começar, verifique se não há arquivos `my.cnf` que interfiram com sua configuração! Você pode verificar os argumentos de `my.cnf` com o **mysqld --print-defaults** e evitar usá-los ao iniciar com **mysqld --no-defaults ...**.

Se o **mysqld** começar a consumir CPU ou memória ou se “ficar parado”, você pode usar **mysqladmin processlist status** para descobrir se alguém está executando uma consulta que leva muito tempo. Pode ser uma boa ideia executar **mysqladmin -i10 processlist status** em uma janela se você estiver enfrentando problemas de desempenho ou problemas quando novos clientes não conseguem se conectar.

O comando **mysqladmin debug** libera algumas informações sobre os bloqueios em uso, memória usada e uso de consultas no arquivo de log do MySQL. Isso pode ajudar a resolver alguns problemas. Esse comando também fornece algumas informações úteis mesmo que você não tenha compilado o MySQL para depuração!

Se o problema for que algumas tabelas estão ficando mais e mais lentas, você deve tentar otimizar a tabela com `OPTIMIZE TABLE` ou **myisamchk**. Veja o Capítulo 7, *Administração do Servidor MySQL*. Você também deve verificar as consultas lentas com `EXPLAIN`.

Você também deve ler a seção específica do sistema operacional neste manual para problemas que podem ser únicos ao seu ambiente. Veja a Seção 2.1, “Orientações Gerais de Instalação”.