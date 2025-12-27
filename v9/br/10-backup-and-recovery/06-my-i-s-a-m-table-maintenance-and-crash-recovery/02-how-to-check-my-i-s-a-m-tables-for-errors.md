### 9.6.2 Como verificar as tabelas MyISAM em busca de erros

Para verificar uma tabela `MyISAM`, use os seguintes comandos:

* **myisamchk *`tbl_name`***

  Isso encontra 99,99% de todos os erros. O que ele não consegue encontrar é corrupção que envolve *apenas* o arquivo de dados (o que é muito incomum). Se você deseja verificar uma tabela, normalmente deve executar **myisamchk** sem opções ou com a opção `-s` (silenciosa).

* **myisamchk -m *`tbl_name`***

  Isso encontra 99,999% de todos os erros. Primeiro, ele verifica todas as entradas de índice em busca de erros e depois lê todas as linhas. Ele calcula um checksum para todos os valores de chave nas linhas e verifica se o checksum corresponde ao checksum para as chaves na árvore de índice.

* **myisamchk -e *`tbl_name`***

  Isso realiza uma verificação completa e minuciosa de todos os dados (`-e` significa “verificação estendida”). Ele faz uma leitura de verificação de cada chave para cada linha para verificar se elas realmente apontam para a linha correta. Isso pode levar muito tempo para uma tabela grande que tem muitos índices. Normalmente, **myisamchk** para após o primeiro erro que encontrar. Se você deseja obter mais informações, pode adicionar a opção `-v` (verbose). Isso faz com que **myisamchk** continue, até um máximo de 20 erros.

* **myisamchk -e -i *`tbl_name`***

  Isso é como o comando anterior, mas a opção `-i` informa ao **myisamchk** para imprimir informações estatísticas adicionais.

Na maioria dos casos, um simples comando **myisamchk** sem argumentos além do nome da tabela é suficiente para verificar uma tabela.