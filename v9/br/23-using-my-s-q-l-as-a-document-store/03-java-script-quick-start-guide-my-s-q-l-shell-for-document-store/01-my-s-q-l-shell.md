### 22.3.1 MySQL Shell

Este guia rápido assume um certo nível de familiaridade com o MySQL Shell. A seção a seguir é uma visão geral de alto nível, consulte a documentação do MySQL Shell para mais informações. O MySQL Shell é uma interface de script unificada para o MySQL Server. Ele suporta script em JavaScript e Python. O SQL é o modo de processamento padrão.

#### Iniciar o MySQL Shell

Depois de instalar e iniciar o servidor MySQL, conecte o MySQL Shell à instância do servidor. Você precisa saber o endereço da instância do servidor MySQL a que pretende se conectar. Para poder usar a instância como um Armazenamento de Documentos, a instância do servidor deve ter o Plugin X instalado e você deve se conectar ao servidor usando o Protocolo X. Por exemplo, para se conectar à instância `ds1.example.com` na porta padrão X de 33060, use a string de rede `user@ds1.example.com:33060`.

Dica

Se você se conectar à instância usando o protocolo MySQL clássico, por exemplo, usando a porta padrão `port` de 3306 em vez do `mysqlx_port`, você *não* pode usar a funcionalidade do Armazenamento de Documentos mostrada neste tutorial. Por exemplo, o objeto global `db` não é preenchido. Para usar o Armazenamento de Documentos, sempre se conecte usando o Protocolo X.

Se o MySQL Shell ainda não estiver em execução, abra uma janela de terminal e execute:

```
mysqlsh user@ds1.example.com:33060/world_x
```

Alternativamente, se o MySQL Shell já estiver em execução, use o comando `\connect` executando:

```
\connect user@ds1.example.com:33060/world_x
```

Você precisa especificar o endereço da instância do servidor MySQL a que deseja se conectar o MySQL Shell. Por exemplo, no exemplo anterior:

* `user` representa o nome de usuário da sua conta MySQL.
* `ds1.example.com` é o hostname da instância do servidor que está executando o MySQL. Substitua isso pelo hostname da instância do servidor MySQL que você está usando como Armazenamento de Documentos.

* O esquema padrão para esta sessão é `world_x`. Para obter instruções sobre como configurar o esquema `world_x`, consulte a Seção 22.3.2, “Baixar e importar o banco de dados world_x”.

Para mais informações, consulte a Seção 6.2.5, “Conectar ao servidor usando strings semelhantes a URI ou pares de chave-valor”.

Uma vez que o MySQL Shell seja aberto, o prompt `mysql-js>` indica que o idioma ativo para esta sessão é SQL.

```
MYSQL SQL>
```

O MySQL Shell suporta a edição de linhas de entrada da seguinte forma:

* As teclas **seta para a esquerda** e **seta para a direita** movem-se horizontalmente na linha de entrada atual.

* As teclas **seta para cima** e **seta para baixo** movem-se para cima e para baixo pelo conjunto de linhas inseridas anteriormente.

* A tecla **Backspace** exclui o caractere antes do cursor e a digitação de novos caracteres os insere na posição do cursor.

* O botão **Enter** envia a linha de entrada atual para o servidor.

#### Obter ajuda para o MySQL Shell

Digite **mysqlsh --help** no prompt do seu interpretador de comandos para obter uma lista de opções de linha de comando.

```
mysqlsh --help
```

Digite `\help` no prompt do MySQL Shell para obter uma lista de comandos disponíveis e suas descrições.

```
mysql-js> \help
```

Digite `\help` seguido do nome do comando para obter ajuda detalhada sobre um comando individual do MySQL Shell. Por exemplo, para visualizar a ajuda sobre o comando `\connect`, execute:

```
mysql-js> \help \connect
```

#### Sair do MySQL Shell

Para sair do MySQL Shell, execute o seguinte comando:

```
mysql-js> \quit
```

#### Informações relacionadas

* Veja Execução de código interativa para uma explicação sobre como a execução de código interativa funciona no MySQL Shell.

* Veja Começando com o MySQL Shell para aprender sobre alternativas de sessão e conexão.