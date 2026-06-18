#### 25.6.14.1 Configuração e uso da criptografia do sistema de arquivos NDB

*Criptografia do sistema de arquivos*: Para habilitar a criptografia de um sistema de arquivos anteriormente não criptografado, são necessários os seguintes passos:

1. Defina os parâmetros do nó de dados necessários na seção `[ndbd default]` do arquivo `config.ini`, conforme mostrado aqui:

   ```
   [ndbd default]
   EncryptedFileSystem= 1
   ```

   Esses parâmetros devem ser configurados conforme mostrado em todos os nós de dados.

2. Inicie o servidor de gerenciamento com `--initial` ou `--reload` para fazer com que ele leia o arquivo de configuração atualizado.

3. Realize um início inicial (ou reinício) contínuo de todos os nós de dados (consulte a Seção 25.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”): Inicie cada nó de dados com `--initial`; além disso, forneça uma das opções `--filesystem-password` ou `--filesystem-password-from-stdin`, além de uma senha, a cada processo do nó de dados. Quando você fornecer a senha na linha de comando, uma mensagem de aviso é exibida, semelhante a esta:

   ```
   > ndbmtd -c 127.0.0.1 --filesystem-password=ndbsecret
   ndbmtd: [Warning] Using a password on the command line interface can be insecure.
   2022-08-22 16:17:58 [ndbd] INFO     -- Angel connected to '127.0.0.1:1186'
   2022-08-22 16:17:58 [ndbd] INFO     -- Angel allocated nodeid: 5
   ```

   `--filesystem-password` pode aceitar a senha de um arquivo, `tty`, ou `stdin`; `--filesystem-password-from-stdin` aceita a senha de `stdin` apenas. Este último protege a senha da exposição na linha de comando do processo ou no sistema de arquivos, e permite a possibilidade de passá-la de outra aplicação segura.

   Você também pode colocar a senha em um arquivo `my.cnf` que pode ser lido pelo processo do nó de dados, mas não por outros usuários do sistema. Usando a mesma senha do exemplo anterior, a parte relevante do arquivo deve parecer assim:

   ```
   [ndbd]

   filesystem-password=ndbsecret
   ```

   Você também pode solicitar que o usuário que inicia o processo do nó de dados forneça a senha de criptografia ao fazer isso, usando a opção `--filesystem-password-from-stdin` no arquivo `my.cnf`, da seguinte maneira:

   ```
   [ndbd]

   filesystem-password-from-stdin
   ```

   Nesse caso, o usuário é solicitado a digitar a senha ao iniciar o processo do nó de dados, conforme mostrado aqui:

   ```
   > ndbmtd -c 127.0.0.1
   Enter filesystem password: *********
   2022-08-22 16:36:00 [ndbd] INFO     -- Angel connected to '127.0.0.1:1186'
   2022-08-22 16:36:00 [ndbd] INFO     -- Angel allocated nodeid: 5
   >
   ```

   Independentemente do método utilizado, o formato da senha de criptografia é o mesmo utilizado para senhas de backups criptografados (consulte a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento de NDB Cluster para Criar um Backup”); a senha deve ser fornecida ao iniciar cada processo do nó de dados; caso contrário, o processo do nó de dados não poderá ser iniciado. Isso é indicado pela seguinte mensagem no log do nó de dados:

   ```
   > tail -n2 ndb_5_out.log
   2022-08-22 16:08:30 [ndbd] INFO     -- Data node configured to have encryption but password not provided
   2022-08-22 16:08:31 [ndbd] ALERT    -- Node 5: Forced node shutdown completed. Occurred during startphase 0.
   ```

   Quando reiniciado conforme descrito, cada nó de dados limpa seu estado no disco e o reconstrui em formato criptografado.

*Rotacionar a senha do sistema de arquivos*: Para atualizar a senha de criptografia usada pelos nós de dados, realize um reinício inicial rotativo dos nós de dados, fornecendo a nova senha a cada nó de dados ao reiniciá-lo usando `--filesystem-password` ou `--filesystem-password-from-stdin`.

*Descriptografia do sistema de arquivos*: Para remover a criptografia de um sistema de arquivos criptografado, faça o seguinte:

1. Na seção `[ndbd default]` do arquivo `config.ini`, defina `EncryptedFileSystem = OFF`.

2. Reinicie o servidor de gerenciamento com `--initial` ou `--reload`.

3. Realize um reinício inicial em rolagem dos nós de dados. *Não* use nenhuma opção relacionada à senha ao reiniciar os binários do nó.

   Ao ser reiniciado, cada nó de dados limpa seu estado no disco e o reconstrui em formato não criptografado.

Para verificar se a criptografia do sistema de arquivos está configurada corretamente, você pode usar uma consulta nas tabelas `ndbinfo` `config_values` e `config_params` semelhante a esta:

```
mysql> SELECT v.node_id AS Node, p.param_name AS Parameter, v.config_value AS Value
    ->    FROM ndbinfo.config_values v
    ->  JOIN ndbinfo.config_params p
    ->    ON v.config_param=p.param_number
    ->  WHERE p.param_name='EncryptedFileSystem';
+------+----------------------+-------+
| Node | Parameter            | Value |
+------+----------------------+-------+
|    5 | EncryptedFileSystem  | 1     |
|    6 | EncryptedFileSystem  | 1     |
|    7 | EncryptedFileSystem  | 1     |
|    8 | EncryptedFileSystem  | 1     |
+------+----------------------+-------+
4 rows in set (0.10 sec)
```

Aqui, `EncryptedFileSystem` é igual a `1` em todos os nós de dados, o que significa que a criptografia do sistema de arquivos está habilitada para este clúster.
