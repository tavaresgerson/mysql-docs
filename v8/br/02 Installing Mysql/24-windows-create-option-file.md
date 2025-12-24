#### 2.3.3.2 Criação de um ficheiro de opções

Se você precisar especificar opções de inicialização quando executar o servidor, você pode indicá-las na linha de comando ou colocá-las em um arquivo de opções. Para opções que são usadas toda vez que o servidor é iniciado, você pode achar mais conveniente usar um arquivo de opções para especificar sua configuração do MySQL. Isto é particularmente verdadeiro sob as seguintes circunstâncias:

- Os locais de instalação ou diretório de dados são diferentes dos locais padrão (`C:\Program Files\MySQL\MySQL Server 8.4` e `C:\Program Files\MySQL\MySQL Server 8.4\data`).
- Você precisa ajustar as configurações do servidor, como memória, cache, ou informações de configuração do InnoDB.

Quando o servidor MySQL é iniciado no Windows, ele procura por arquivos de opções em vários locais, como o diretório do Windows, `C:\`, e o diretório de instalação do MySQL (para a lista completa de locais, veja Seção 6.2.2.2, Using Option Files). O diretório do Windows normalmente é nomeado algo como `C:\WINDOWS`. Você pode determinar sua localização exata a partir do valor da variável de ambiente `WINDIR` usando o seguinte comando:

```
C:\> echo %WINDIR%
```

O MySQL procura por opções em cada localização primeiro no arquivo `my.ini`, e depois no arquivo `my.cnf`. No entanto, para evitar confusão, é melhor se você usar apenas um arquivo. Se o seu PC usa um carregador de inicialização onde `C:` não é a unidade de inicialização, sua única opção é usar o arquivo `my.ini`.

::: info Note

Ao usar o MySQL Configurator para configurar o MySQL Server, ele cria o `my.ini` no local padrão, e o usuário que executa o MySQL Configurator recebe permissões completas para este novo `my.ini` arquivo.

Em outras palavras, certifique-se de que o usuário do MySQL Server tem permissão para ler o arquivo `my.ini`.

:::

Também pode utilizar os ficheiros de opções de exemplo incluídos na sua distribuição MySQL; ver Secção 7.1.2, "Configuração padrão do servidor".

Um arquivo de opções pode ser criado e modificado com qualquer editor de texto, como o Bloco de Notas. Por exemplo, se o MySQL está instalado em `E:\mysql` e o diretório de dados está em `E:\mydata\data`, você pode criar um arquivo de opções contendo uma seção `[mysqld]` para especificar valores para as opções `basedir` e `datadir`:

```
[mysqld]
# set basedir to your installation path
basedir=E:/mysql
# set datadir to the location of your data directory
datadir=E:/mydata/data
```

Os nomes de caminho do Microsoft Windows são especificados em arquivos de opções usando barras (para a frente) em vez de barras invertidas. Se você usar barras invertidas, duplique-as:

```
[mysqld]
# set basedir to your installation path
basedir=E:\\mysql
# set datadir to the location of your data directory
datadir=E:\\mydata\\data
```

As regras para a utilização da barra invertida nos valores dos ficheiros de opções constam da secção 6.2.2.2, "Utilização dos ficheiros de opções".

O arquivo ZIP não inclui um diretório `data`. Para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no banco de dados do sistema mysql, inicialize o MySQL usando `--initialize` ou `--initialize-insecure`.

Se você deseja usar um diretório de dados em um local diferente, você deve copiar todo o conteúdo do diretório `data` para o novo local. Por exemplo, se você quiser usar `E:\mydata` como diretório de dados em vez disso, você deve fazer duas coisas:

1. Mova todo o diretório `data` e todo o seu conteúdo do local padrão (por exemplo `C:\Program Files\MySQL\MySQL Server 8.4\data`) para `E:\mydata`.
2. Use uma opção `--datadir` para especificar a nova localização do diretório de dados cada vez que você iniciar o servidor.
