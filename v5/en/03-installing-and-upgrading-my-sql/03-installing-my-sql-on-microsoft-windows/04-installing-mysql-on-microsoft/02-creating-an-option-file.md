#### 2.3.4.2 Criando um Option File

Se você precisar especificar as opções de inicialização ao executar o Server, você pode indicá-las na linha de comando ou colocá-las em um Option File. Para opções que são usadas toda vez que o Server inicia, você pode achar mais conveniente usar um Option File para especificar sua configuração MySQL. Isso é particularmente verdadeiro nas seguintes circunstâncias:

* Os locais do diretório de instalação ou do Data Directory são diferentes dos locais padrão (`C:\Program Files\MySQL\MySQL Server 5.7` e `C:\Program Files\MySQL\MySQL Server 5.7\data`).

* Você precisa otimizar as configurações do Server (tune), como memória, cache ou informações de configuração do InnoDB.

Quando o MySQL Server inicia no Windows, ele procura por Option Files em diversos locais, como o diretório do Windows, `C:\`, e o diretório de instalação do MySQL (para a lista completa de locais, consulte a Seção 4.2.2.2, “Using Option Files”). O diretório do Windows é tipicamente nomeado como algo como `C:\WINDOWS`. Você pode determinar sua localização exata a partir do valor da variável de ambiente `WINDIR` usando o seguinte comando:

```sql
C:\> echo %WINDIR%
```

MySQL procura opções em cada local, primeiro no arquivo `my.ini` e, em seguida, no arquivo `my.cnf`. No entanto, para evitar confusão, é melhor usar apenas um arquivo. Se o seu PC usar um boot loader onde `C:` não é a unidade de boot, sua única opção é usar o arquivo `my.ini`. Seja qual for o Option File que você usar, ele deve ser um arquivo de texto simples (plain text file).

Note

Ao usar o MySQL Installer para instalar o MySQL Server, ele cria o `my.ini` no local padrão, e o usuário que executa o MySQL Installer recebe permissões completas para este novo arquivo `my.ini`.

Em outras palavras, certifique-se de que o usuário do MySQL Server tenha permissão para ler o arquivo `my.ini`.

Você também pode usar os Option Files de exemplo incluídos na sua distribuição MySQL; consulte a Seção 5.1.2, “Server Configuration Defaults”.

Um Option File pode ser criado e modificado com qualquer editor de texto, como o Notepad. Por exemplo, se o MySQL estiver instalado em `E:\mysql` e o Data Directory estiver em `E:\mydata\data`, você pode criar um Option File contendo uma seção `[mysqld]` para especificar valores para as opções `basedir` e `datadir`:

```sql
[mysqld]
# set basedir to your installation path
basedir=E:/mysql
# set datadir to the location of your data directory
datadir=E:/mydata/data
```

Nomes de caminho (path names) do Microsoft Windows são especificados em Option Files usando barras (forward slashes) em vez de barras invertidas (backslashes). Se você usar barras invertidas, duplique-as:

```sql
[mysqld]
# set basedir to your installation path
basedir=E:\\mysql
# set datadir to the location of your data directory
datadir=E:\\mydata\\data
```

As regras para o uso de barras invertidas em valores de Option File são fornecidas na Seção 4.2.2.2, “Using Option Files”.

A partir do MySQL 5.7.6, o arquivo ZIP não inclui mais um Data Directory. Para inicializar uma instalação MySQL criando o Data Directory e preenchendo as tabelas no system database `mysql`, inicialize o MySQL usando `--initialize` ou `--initialize-insecure`. Para informações adicionais, consulte a Seção 2.9.1, “Initializing the Data Directory”.

Se você deseja usar um Data Directory em um local diferente, você deve copiar todo o conteúdo do Data Directory para o novo local. Por exemplo, se você quiser usar `E:\mydata` como o Data Directory, você deve fazer duas coisas:

1. Mover todo o diretório `data` e todo o seu conteúdo do local padrão (por exemplo, `C:\Program Files\MySQL\MySQL Server 5.7\data`) para `E:\mydata`.

2. Usar uma opção `--datadir` para especificar o novo local do Data Directory toda vez que você iniciar o Server.