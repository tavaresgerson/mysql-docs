### 2.11.5 Solução de problemas de downgrade

Se você descer de uma série de lançamentos para outra, pode haver incompatibilidades nos formatos de armazenamento de tabelas. Nesse caso, use o **mysqldump** para fazer o dump de suas tabelas antes de fazer o downgrade. Após o downgrade, recarregue o arquivo de dump usando o **mysql** ou **mysqlimport** para recriar suas tabelas. Para exemplos, consulte a Seção 2.10.13, “Copiar bancos de dados MySQL para outra máquina”.

Um sintoma típico de uma mudança no formato da tabela incompatível com a versão anterior é a impossibilidade de abrir as tabelas. Nesse caso, siga o procedimento a seguir:

1. Pare o servidor MySQL mais antigo que você está desatualizando.

2. Reinicie o servidor MySQL mais recente do qual você está fazendo a atualização para uma versão anterior.

3. Remova todas as tabelas que não estavam acessíveis ao servidor mais antigo usando **mysqldump** para criar um arquivo de backup.

4. Pare o servidor MySQL mais recente e reinicie o mais antigo.

5. Recarregue o arquivo de dump no servidor mais antigo. Suas tabelas devem estar acessíveis.
