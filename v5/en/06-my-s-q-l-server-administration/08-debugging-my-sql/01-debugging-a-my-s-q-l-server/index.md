### 5.8.1 Debugging de um MySQL Server

[5.8.1.1 Compilando o MySQL para Debugging](compiling-for-debugging.html)

[5.8.1.2 Criando Trace Files](making-trace-files.html)

[5.8.1.3 Usando WER com PDB para criar um Windows crashdump](making-windows-dumps.html)

[5.8.1.4 Debugging do mysqld sob gdb](using-gdb-on-mysqld.html)

[5.8.1.5 Usando um Stack Trace](using-stack-trace.html)

[5.8.1.6 Usando Logs do Server para Encontrar Causas de Erros no mysqld](using-log-files.html)

[5.8.1.7 Criando um Caso de Teste Caso Você Encontre Corrupção de Tabela](reproducible-test-case.html)

Se você estiver usando alguma funcionalidade que é muito nova no MySQL, você pode tentar executar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção [`--skip-new`](server-options.html#option_mysqld_skip-new) (que desabilita todas as funcionalidades novas e potencialmente inseguras). Consulte [Section B.3.3.3, “O Que Fazer Se o MySQL Continuar Crashando”](crashing.html "B.3.3.3 O Que Fazer Se o MySQL Continuar Crashando").

Se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não quiser iniciar, verifique se você não tem arquivos `my.cnf` que estejam interferindo em sua configuração! Você pode verificar seus argumentos `my.cnf` com [**mysqld --print-defaults**](mysqld.html "4.3.1 mysqld — The MySQL Server") e evitar usá-los iniciando com [**mysqld --no-defaults ...**](mysqld.html "4.3.1 mysqld — The MySQL Server").

Se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") começar a consumir muita CPU ou memória ou se ele "travar", você pode usar [**mysqladmin processlist status**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") para descobrir se alguém está executando uma Query que leva muito tempo. Pode ser uma boa ideia executar [**mysqladmin -i10 processlist status**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") em alguma janela se você estiver enfrentando problemas de performance ou problemas quando novos Clients não conseguem se conectar.

O comando [**mysqladmin debug**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") despeja algumas informações sobre Locks em uso, memória utilizada e uso de Query no arquivo de Log do MySQL. Isso pode ajudar a resolver alguns problemas. Este comando também fornece algumas informações úteis mesmo que você não tenha compilado o MySQL para Debugging!

Se o problema é que algumas tabelas estão ficando cada vez mais lentas, você deve tentar otimizar a tabela com [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") ou [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). Consulte [Chapter 5, *MySQL Server Administration*](server-administration.html "Chapter 5 MySQL Server Administration"). Você também deve verificar as Slow Queries com [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement").

Você também deve ler a seção específica do Sistema Operacional (OS) neste manual para problemas que podem ser exclusivos do seu ambiente. Consulte [Section 2.1, “Orientações Gerais de Instalação”](general-installation-issues.html "2.1 Orientações Gerais de Instalação").