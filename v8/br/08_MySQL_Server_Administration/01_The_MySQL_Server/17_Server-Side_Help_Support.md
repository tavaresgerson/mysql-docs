### 7.1.17 Suporte de Ajuda no Lado do Servidor

O MySQL Server suporta uma instrução `HELP` que retorna informações do Manual de Referência do MySQL (veja a Seção 15.8.3, “Instrução HELP”). Essas informações são armazenadas em várias tabelas no esquema `mysql` (veja a Seção 7.3, “O Esquema do Sistema mysql”). O funcionamento adequado da instrução `HELP` requer que essas tabelas de ajuda sejam inicializadas.

Para uma nova instalação do MySQL usando uma distribuição binária ou de fonte no Unix, a inicialização do conteúdo da tabela de ajuda ocorre quando você inicializa o diretório de dados (consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”). Para uma distribuição RPM no Linux ou distribuição binária no Windows, a inicialização do conteúdo ocorre como parte do processo de instalação do MySQL.

Para uma atualização do MySQL usando uma distribuição binária, o conteúdo da tabela de ajuda é atualizado automaticamente pelo servidor a partir do MySQL 8.0.16. Antes do MySQL 8.0.16, o conteúdo não é atualizado automaticamente, mas você pode atualizá-lo manualmente. Localize o arquivo `fill_help_tables.sql` no diretório `share` ou `share/mysql`. Mude a localização para esse diretório e processe o arquivo com o cliente **mysql** da seguinte forma:

```
mysql -u root -p mysql < fill_help_tables.sql
```

O comando mostrado aqui assume que você se conecta ao servidor usando uma conta como `root` que tenha privilégios para modificar tabelas no esquema `mysql`. Ajuste os parâmetros de conexão conforme necessário.

Antes do MySQL 8.0.16, se você estiver trabalhando com o Git e uma árvore de código de desenvolvimento do MySQL, a árvore de código contém apenas uma versão "esboçada" do `fill_help_tables.sql`. Para obter uma cópia que não seja uma versão esboçada, use uma de uma distribuição de código fonte ou binária.

Nota

Cada série do MySQL tem seu próprio manual de referência específico para a série, então o conteúdo da tabela de ajuda também é específico da série. Isso tem implicações para a replicação, pois o conteúdo da tabela de ajuda deve corresponder à série do MySQL. Se você carregar o conteúdo de ajuda do MySQL 8.0 em um servidor de replicação do MySQL 8.0, não faz sentido replicar esse conteúdo para um servidor replica em uma série diferente do MySQL, para o qual esse conteúdo não é apropriado. Por essa razão, ao atualizar servidores individuais em um cenário de replicação, você deve atualizar as tabelas de ajuda de cada servidor, usando as instruções fornecidas anteriormente. (A atualização do conteúdo da ajuda manual é necessária apenas para servidores de replicação de versões inferiores a 8.0.16. Como mencionado nas instruções anteriores, as atualizações de conteúdo ocorrem automaticamente a partir do MySQL 8.0.16.)
