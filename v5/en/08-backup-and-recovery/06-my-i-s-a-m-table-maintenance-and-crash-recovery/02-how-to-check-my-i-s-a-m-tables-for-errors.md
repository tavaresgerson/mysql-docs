### 7.6.2 Como Verificar Tabelas MyISAM em Busca de Erros

Para verificar uma tabela `MyISAM`, use os seguintes comandos:

* **myisamchk *`tbl_name`***

  Isso encontra 99,99% de todos os erros. O que ele não consegue encontrar é corrupção que envolve *apenas* o arquivo de dados (o que é muito incomum). Se você deseja verificar uma tabela, você deve normalmente executar **myisamchk** sem opções ou com a opção `-s` (silent).

* **myisamchk -m *`tbl_name`***

  Isso encontra 99,999% de todos os erros. Ele primeiro verifica todas as entradas de Index em busca de erros e, em seguida, lê todas as linhas. Ele calcula um `Checksum` para todos os valores de `Key` nas linhas e verifica se o `Checksum` corresponde ao `Checksum` das `Keys` na árvore de Index.

* **myisamchk -e *`tbl_name`***

  Isso realiza uma verificação completa e minuciosa de todos os dados (`-e` significa “extended check” [verificação estendida]). Ele realiza uma leitura de verificação (`check-read`) de cada `Key` para cada linha para verificar se elas realmente apontam para a linha correta. Isso pode levar muito tempo para uma tabela grande que possui muitos `Indexes`. Normalmente, **myisamchk** para após o primeiro erro encontrado. Se você deseja obter mais informações, você pode adicionar a opção `-v` (verbose). Isso faz com que **myisamchk** continue, registrando um máximo de 20 erros.

* **myisamchk -e -i *`tbl_name`***

  Isto é como o comando anterior, mas a opção `-i` instrui **myisamchk** a imprimir informações estatísticas adicionais.

Na maioria dos casos, um comando simples **myisamchk** sem argumentos além do nome da tabela é suficiente para verificar uma tabela.