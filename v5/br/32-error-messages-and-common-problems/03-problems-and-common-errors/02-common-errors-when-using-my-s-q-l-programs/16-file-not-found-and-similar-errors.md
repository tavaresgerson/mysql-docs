#### B.3.2.16 Arquivo não encontrado e erros semelhantes

Se você receber `ERROR 'nome_do_arquivo' não encontrado (errno: 23)`, `Não é possível abrir o arquivo: nome_do_arquivo (errno: 24)` ou qualquer outro erro com `errno 23` ou `errno 24` do MySQL, isso significa que você não allocou descritores de arquivo suficientes para o servidor MySQL. Você pode usar o utilitário [**perror**](perror.html) para obter uma descrição do que o número do erro significa:

```sql
$> perror 23
OS error code  23:  File table overflow
$> perror 24
OS error code  24:  Too many open files
$> perror 11
OS error code  11:  Resource temporarily unavailable
```

O problema aqui é que o [**mysqld**](mysqld.html) está tentando manter abertos muitos arquivos simultaneamente. Você pode dizer ao [**mysqld**](mysqld.html) para não abrir tantos arquivos de uma só vez ou aumentar o número de descritores de arquivo disponíveis para o [**mysqld**](mysqld.html).

Para fazer com que [**mysqld**](mysqld.html) mantenha abertos menos arquivos de cada vez, você pode reduzir o tamanho da cache da tabela diminuindo o valor da variável de sistema [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache) (o valor padrão é 64). Isso pode não impedir completamente a escassez de descritores de arquivo, pois, em algumas circunstâncias, o servidor pode tentar estender o tamanho da cache temporariamente, conforme descrito em [Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tabelas”](table-cache.html). Reduzir o valor de [`max_connections`](server-system-variables.html#sysvar_max_connections) também reduz o número de arquivos abertos (o valor padrão é 100).

Para alterar o número de descritores de arquivo disponíveis para [**mysqld**](mysqld.html), você pode usar a opção [`--open-files-limit`](mysqld-safe.html#option_mysqld_safe_open-files-limit) para [**mysqld\_safe**](mysqld-safe.html) ou definir a variável de sistema [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit). Veja [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html). A maneira mais fácil de definir esses valores é adicionar uma opção ao seu arquivo de opções. Veja [Seção 4.2.2.2, “Usando Arquivos de Opções”](option-files.html). Se você tiver uma versão antiga do [**mysqld**](mysqld.html) que não suporta a configuração do limite de arquivos abertos, você pode editar o script de [**mysqld\_safe**](mysqld-safe.html). Há uma linha com comentário **ulimit -n 256** no script. Você pode remover o caractere `#` para desfazer esse comentário e alterar o número `256` para definir o número de descritores de arquivo a serem disponibilizados para [**mysqld**](mysqld.html).

[`--open-files-limit`](mysqld-safe.html#option_mysqld_safe_open-files-limit) e **ulimit** podem aumentar o número de descritores de arquivo, mas apenas até o limite imposto pelo sistema operacional. Há também um limite "fixo" que só pode ser ignorado se você iniciar o [**mysqld\_safe**](mysqld-safe.html) ou [**mysqld**](mysqld.html) como `root` (lembre-se de que você também precisa iniciar o servidor com a opção [`--user`](server-options.html#option_mysqld_user) neste caso, para que ele não continue rodando como `root` após ser iniciado). Se você precisar aumentar o limite do sistema operacional sobre o número de descritores de arquivo disponíveis para cada processo, consulte a documentação do seu sistema.

Nota

Se você executar o shell **tcsh**, o **ulimit** não funciona! O **tcsh** também reporta valores incorretos quando você solicita os limites atuais. Nesse caso, você deve iniciar o [**mysqld\_safe**](mysqld-safe.html) usando o **sh**.
