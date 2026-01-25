### 2.11.5 Solução de Problemas no Downgrade

Se você fizer o downgrade de uma série de lançamento para outra, pode haver incompatibilidades nos formatos de armazenamento de tabela. Neste caso, use o **mysqldump** para fazer o dump de suas tabelas antes do downgrade. Após o downgrade, recarregue o dump file usando o **mysql** ou **mysqlimport** para re-criar suas tabelas. Para exemplos, consulte a Seção 2.10.13, “Copiando MySQL Databases para Outra Máquina”.

Um sintoma típico de uma alteração de formato de tabela incompatível para downgrade é a incapacidade de abrir as tabelas. Nesse caso, utilize o seguinte procedimento:

1. Pare o MySQL server mais antigo para o qual você está fazendo o downgrade.
2. Reinicie o MySQL server mais novo do qual você está fazendo o downgrade.
3. Faça o dump de quaisquer tabelas que estavam inacessíveis para o server mais antigo usando o **mysqldump** para criar um dump file.

4. Pare o MySQL server mais novo e reinicie o mais antigo.
5. Recarregue o dump file no server mais antigo. Suas tabelas devem estar acessíveis.