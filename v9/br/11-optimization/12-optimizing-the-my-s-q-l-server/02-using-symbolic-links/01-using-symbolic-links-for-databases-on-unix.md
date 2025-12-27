#### 10.12.2.1 Usando Links Simbólicos para Bancos de Dados no Unix

No Unix, crie um link simbólico para um banco de dados usando este procedimento:

1. Crie o banco de dados usando `CREATE DATABASE`:

   ```
   mysql> CREATE DATABASE mydb1;
   ```

   Usando `CREATE DATABASE`, cria o banco de dados no diretório de dados do MySQL e permite que o servidor atualize o dicionário de dados com informações sobre o diretório do banco de dados.

2. Parar o servidor para garantir que nenhuma atividade ocorra no novo banco de dados enquanto ele estiver sendo movido.

3. Mover o diretório do banco de dados para um disco onde você tenha espaço livre. Por exemplo, use **tar** ou **mv**. Se você usar um método que copia em vez de mover o diretório do banco de dados, remova o diretório original do banco de dados após copiá-lo.

4. Crie um link simbólico no diretório de dados para o diretório do banco de dados movido:

   ```
   $> ln -s /path/to/mydb1 /path/to/datadir
   ```

   O comando cria um link simbólico chamado `mydb1` no diretório de dados.

5. Reinicie o servidor.