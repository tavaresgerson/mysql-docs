#### 2.3.3.2 Criando um arquivo de opções

Se você precisar especificar opções de inicialização ao executar o servidor, pode indicá-las na linha de comando ou colocá-las em um arquivo de opções. Para opções que são usadas toda vez que o servidor é iniciado, pode ser mais conveniente usar um arquivo de opções para especificar a configuração do MySQL. Isso é particularmente verdadeiro nas seguintes circunstâncias:

* As localizações dos diretórios de instalação ou de dados são diferentes das localizações padrão (`C:\Program Files\MySQL\MySQL Server 8.4` e `C:\Program Files\MySQL\MySQL Server 8.4\data`).
* Você precisa ajustar as configurações do servidor, como memória, cache ou informações de configuração do InnoDB.

Quando o servidor MySQL é iniciado no Windows, ele procura por arquivos de opções em vários locais, como o diretório do Windows, `C:\` e o diretório de instalação do MySQL (para a lista completa de locais, consulte a Seção 6.2.2.2, “Usando arquivos de opções”). O diretório do Windows geralmente é nomeado algo como `C:\WINDOWS`. Você pode determinar sua localização exata pelo valor da variável de ambiente `WINDIR` usando o seguinte comando:

```
C:\> echo %WINDIR%
```

O MySQL procura por opções em cada local primeiro no arquivo `my.ini` e, em seguida, no arquivo `my.cnf`. No entanto, para evitar confusão, é melhor usar apenas um arquivo. Se o seu PC usar um carregador de inicialização onde `C:` não é a unidade de inicialização, sua única opção é usar o arquivo `my.ini`. Independentemente do arquivo de opções que você usar, ele deve ser um arquivo de texto simples.

::: info Nota

Ao usar o MySQL Configurator para configurar o MySQL Server, ele cria o `my.ini` na localização padrão, e o usuário que executa o MySQL Configurator é concedido permissões completas para esse novo arquivo `my.ini`.

Em outras palavras, certifique-se de que o usuário do MySQL Server tenha permissão para ler o arquivo `my.ini`.

:::

Você também pode usar os exemplos de arquivos de opções incluídos com sua distribuição do MySQL; consulte a Seção 7.1.2, “Padrões de configuração do servidor”.

Um arquivo de opções pode ser criado e modificado com qualquer editor de texto, como o Bloco de Notas. Por exemplo, se o MySQL estiver instalado em `E:\mysql` e o diretório de dados estiver em `E:\mydata\data`, você pode criar um arquivo de opções contendo uma seção `[mysqld]` para especificar valores para as opções `basedir` e `datadir`:

```
[mysqld]
# set basedir to your installation path
basedir=E:/mysql
# set datadir to the location of your data directory
datadir=E:/mydata/data
```

Os nomes de caminho do Microsoft Windows são especificados em arquivos de opções usando barras invertidas (forward) em vez de barras invertidas (back). Se você usar barras invertidas, duplique-as:

```
[mysqld]
# set basedir to your installation path
basedir=E:\\mysql
# set datadir to the location of your data directory
datadir=E:\\mydata\\data
```

As regras para o uso de barras invertidas em valores de arquivos de opções estão descritas na Seção 6.2.2.2, “Usando Arquivos de Opções”.

O arquivo ZIP não inclui um diretório `data`. Para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no banco de dados do sistema mysql, inicie o MySQL usando `--initialize` ou `--initialize-insecure`. Para obter informações adicionais, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

Se você deseja usar um diretório de dados em um local diferente, você deve copiar todo o conteúdo do diretório `data` para o novo local. Por exemplo, se você quiser usar `E:\mydata` como diretório de dados em vez disso, você deve fazer duas coisas:

1. Mover todo o diretório `data` e todos os seus conteúdos da localização padrão (por exemplo, `C:\Program Files\MySQL\MySQL Server 8.4\data`) para `E:\mydata`.
2. Usar uma opção `--datadir` para especificar a nova localização do diretório de dados cada vez que iniciar o servidor.