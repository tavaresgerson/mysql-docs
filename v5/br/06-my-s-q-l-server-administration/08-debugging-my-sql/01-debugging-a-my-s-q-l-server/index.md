### 5.8.1 Depuração de um servidor MySQL

5.8.1.1 Compilando o MySQL para depuração

5.8.1.2 Criando Arquivos de Rastreamento

5.8.1.3 Usar o WER com o PDB para criar um crashdump do Windows

5.8.1.4 Depuração do mysqld no gdb

5.8.1.5 Usar uma Traça de Pilha

5.8.1.6 Usar logs do servidor para encontrar as causas dos erros no mysqld

5.8.1.7 Criar um Caso de Teste Se Você Experimenta Corrupção na Tabela

Se você estiver usando alguma funcionalidade muito nova no MySQL, tente executar **mysqld** com a opção `--skip-new` (que desabilita todas as novas funcionalidades, potencialmente inseguras). Veja Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

Se o **mysqld** não quiser iniciar, verifique se você não tem arquivos `my.cnf` que interfiram em sua configuração! Você pode verificar os argumentos do `my.cnf` com **mysqld --print-defaults** e evitar usá-los iniciando com **mysqld --no-defaults ...**.

Se o **mysqld** começar a consumir CPU ou memória ou se "travar", você pode usar **mysqladmin processlist status** para descobrir se alguém está executando uma consulta que leva muito tempo. Pode ser uma boa ideia executar **mysqladmin -i10 processlist status** em uma janela se você estiver enfrentando problemas de desempenho ou problemas quando novos clientes não conseguem se conectar.

O comando **mysqladmin debug** exibe algumas informações sobre as chaves de acesso em uso, a memória usada e o uso de consultas no arquivo de log do MySQL. Isso pode ajudar a resolver alguns problemas. Esse comando também fornece informações úteis mesmo que você não tenha compilado o MySQL para depuração!

Se o problema for que algumas tabelas estão ficando cada vez mais lentas, você deve tentar otimizar a tabela com `OPTIMIZE TABLE` ou **myisamchk**. Veja Capítulo 5, *Administração do Servidor MySQL*. Você também deve verificar as consultas lentas com `EXPLAIN`.

Você também deve ler a seção específica do sistema operacional neste manual para problemas que possam ser únicos ao seu ambiente. Consulte Seção 2.1, “Orientações Gerais de Instalação”.
