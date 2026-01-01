#### 2.3.4.2 Criando um arquivo de opção

Se você precisar especificar opções de inicialização ao executar o servidor, pode indicá-las na linha de comando ou colocá-las em um arquivo de opções. Para opções que são usadas sempre que o servidor é iniciado, pode ser mais conveniente usar um arquivo de opções para especificar a configuração do MySQL. Isso é especialmente verdadeiro nas seguintes circunstâncias:

- Os locais de instalação ou diretórios de dados são diferentes dos locais padrão (`C:\Program Files\MySQL\MySQL Server 5.7` e `C:\Program Files\MySQL\MySQL Server 5.7\data`).

- Você precisa ajustar as configurações do servidor, como memória, cache ou informações de configuração do InnoDB.

Quando o servidor MySQL é iniciado no Windows, ele procura por arquivos de opções em vários locais, como o diretório do Windows, `C:\` e o diretório de instalação do MySQL (para a lista completa dos locais, consulte a Seção 4.2.2.2, “Usando arquivos de opção”). O diretório do Windows geralmente é nomeado algo como `C:\WINDOWS`. Você pode determinar sua localização exata a partir do valor da variável de ambiente `WINDIR` usando o seguinte comando:

```sql
C:\> echo %WINDIR%
```

O MySQL procura por opções em cada local primeiro no arquivo `my.ini` e, em seguida, no arquivo `my.cnf`. No entanto, para evitar confusão, é melhor usar apenas um arquivo. Se o seu PC usa um carregador de inicialização onde `C:` não é a unidade de inicialização, sua única opção é usar o arquivo `my.ini`. Independentemente do arquivo de opção que você usar, ele deve ser um arquivo de texto simples.

Nota

Ao usar o Instalador do MySQL para instalar o MySQL Server, ele cria o arquivo `my.ini` na localização padrão, e o usuário que executa o Instalador do MySQL recebe permissões completas para esse novo arquivo `my.ini`.

Em outras palavras, certifique-se de que o usuário do MySQL Server tenha permissão para ler o arquivo `my.ini`.

Você também pode usar os arquivos de exemplo de opção incluídos com sua distribuição MySQL; veja a Seção 5.1.2, “Padrões de configuração do servidor”.

Um arquivo de opções pode ser criado e modificado com qualquer editor de texto, como o Bloco de Notas. Por exemplo, se o MySQL estiver instalado em `E:\mysql` e o diretório de dados estiver em `E:\mydata\data`, você pode criar um arquivo de opções contendo uma seção `[mysqld]` para especificar valores para as opções `basedir` e `datadir`:

```sql
[mysqld]
# set basedir to your installation path
basedir=E:/mysql
# set datadir to the location of your data directory
datadir=E:/mydata/data
```

Os nomes de caminho do Microsoft Windows são especificados em arquivos de opção usando barras inclinadas (forward slashes) em vez de barras invertidas (back slashes). Se você usar barras invertidas, duplique-as:

```sql
[mysqld]
# set basedir to your installation path
basedir=E:\\mysql
# set datadir to the location of your data directory
datadir=E:\\mydata\\data
```

As regras para o uso de barras invertidas nos valores dos arquivos de opção estão descritas na Seção 4.2.2.2, "Usando arquivos de opção".

A partir do MySQL 5.7.6, o arquivo ZIP não inclui mais o diretório `data`. Para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no banco de dados do sistema mysql, inicie o MySQL usando `--initialize` ou `--initialize-insecure`. Para obter informações adicionais, consulte a Seção 2.9.1, “Inicializando o diretório de dados”.

Se você deseja usar um diretório de dados em um local diferente, você deve copiar todo o conteúdo do diretório `data` para o novo local. Por exemplo, se você quiser usar `E:\mydata` como o diretório de dados em vez disso, você deve fazer duas coisas:

1. Mude todo o diretório `data` e todos os seus conteúdos da localização padrão (por exemplo, `C:\Program Files\MySQL\MySQL Server 5.7\data`) para `E:\mydata`.

2. Use a opção `--datadir` para especificar a nova localização do diretório de dados cada vez que você iniciar o servidor.
