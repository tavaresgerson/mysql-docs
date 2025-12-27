#### B.3.2.16 Arquivo Não Encontrado e Erros Semelhantes

Se você receber o `ERROR 'nome_do_arquivo' não encontrado (errno: 23)`, `Não é possível abrir o arquivo: nome_do_arquivo (errno: 24)` ou qualquer outro erro com `errno 23` ou `errno 24` do MySQL, isso significa que você não alocou descritores de arquivo suficientes para o servidor MySQL. Você pode usar o utilitário `perror` para obter uma descrição do que o número do erro significa:

```
$> perror 23
OS error code  23:  File table overflow
$> perror 24
OS error code  24:  Too many open files
$> perror 11
OS error code  11:  Resource temporarily unavailable
```

O problema aqui é que o  `mysqld` está tentando manter abertos muitos arquivos simultaneamente. Você pode informar ao  `mysqld` para não abrir tantos arquivos de uma vez ou aumentar o número de descritores de arquivo disponíveis para o  `mysqld`.

Para informar ao  `mysqld` para manter abertos menos arquivos de cada vez, você pode reduzir o tamanho da cache da tabela reduzindo o valor da variável de sistema  `table_open_cache` (o valor padrão é 64). Isso pode não impedir completamente a escassez de descritores de arquivo, pois, em algumas circunstâncias, o servidor pode tentar estender o tamanho da cache temporariamente, conforme descrito na Seção 10.4.3.1, “Como o MySQL Abre e Fecha Tabelas”. Reduzir o valor de  `max_connections` também reduz o número de arquivos abertos (o valor padrão é 100).

Para alterar o número de descritores de arquivo disponíveis para o  `mysqld`, você pode usar a opção  `--open-files-limit` no  `mysqld_safe` ou definir a variável de sistema  `open_files_limit`. Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”. A maneira mais fácil de definir esses valores é adicionar uma opção ao seu arquivo de opções. Veja a Seção 6.2.2.2, “Usando Arquivos de Opções”. Se você tiver uma versão antiga do  `mysqld` que não suporta definir o limite de arquivos abertos, você pode editar o script  `mysqld_safe`. Há uma linha com comentário **ulimit -n 256** no script. Você pode remover o caractere `#` para desfazer esse comentário e alterar o número `256` para definir o número de descritores de arquivo a serem disponibilizados ao  `mysqld`.

`--open-files-limit` e **ulimit** podem aumentar o número de descritores de arquivo, mas apenas até o limite imposto pelo sistema operacional. Há também um limite "fixo" que só pode ser ignorado se você iniciar o  `mysqld_safe` ou o  `mysqld` como `root` (lembre-se de que você também precisa iniciar o servidor com a opção `--user` neste caso, para que ele não continue rodando como `root` após ser iniciado). Se você precisar aumentar o limite do sistema operacional para o número de descritores de arquivo disponíveis para cada processo, consulte a documentação do seu sistema.

::: info Nota

Se você estiver usando o shell `tcsh`, **ulimit** não funciona! O `tcsh` também reporta valores incorretos quando você solicita os limites atuais. Nesse caso, você deve iniciar o  `mysqld_safe` usando o `sh`.