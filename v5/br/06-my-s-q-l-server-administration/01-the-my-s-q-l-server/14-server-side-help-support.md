### 5.1.14 Suporte de Ajuda no Servidor

O MySQL Server suporta uma instrução `HELP` que retorna informações do Manual de Referência do MySQL (veja Seção 13.8.3, “Instrução HELP”). Essas informações são armazenadas em várias tabelas no banco de dados `mysql` (veja Seção 5.3, “O Banco de Dados do Sistema mysql”). O funcionamento adequado da instrução `HELP` requer que essas tabelas de ajuda sejam inicializadas.

Para uma nova instalação do MySQL usando uma distribuição binária ou de fonte no Unix, a inicialização do conteúdo da tabela de ajuda ocorre quando você inicializa o diretório de dados (consulte Seção 2.9.1, “Inicialização do Diretório de Dados”). Para uma distribuição RPM no Linux ou distribuição binária no Windows, a inicialização do conteúdo ocorre como parte do processo de instalação do MySQL.

Para uma atualização do MySQL usando uma distribuição binária, o conteúdo da tabela de ajuda não é atualizado automaticamente, mas você pode atualizá-lo manualmente. Localize o arquivo `fill_help_tables.sql` no diretório `share` ou `share/mysql`. Mude a localização para esse diretório e processe o arquivo com o cliente **mysql** da seguinte forma:

```sql
mysql -u root -p mysql < fill_help_tables.sql
```

O comando mostrado aqui assume que você se conecta ao servidor usando uma conta como `root` que tenha privilégios para modificar tabelas no banco de dados `mysql`. Ajuste os parâmetros de conexão conforme necessário.

Se você está trabalhando com o Git e uma árvore de código de desenvolvimento do MySQL, a árvore de código contém apenas uma versão "esboçada" do `fill_help_tables.sql`. Para obter uma cópia não esboçada, use uma de uma distribuição de código fonte ou binária.

Nota

Cada série do MySQL tem seu próprio manual de referência específico para a série, portanto, o conteúdo da tabela de ajuda também é específico da série. Isso tem implicações para a replicação, pois o conteúdo da tabela de ajuda deve corresponder à série do MySQL. Se você carregar o conteúdo da ajuda do MySQL 5.7 em um servidor de origem do MySQL 5.7, não faz sentido replicar esse conteúdo para um servidor replica de uma série diferente do MySQL, para o qual esse conteúdo não é apropriado. Por essa razão, ao atualizar servidores individuais em um cenário de replicação, você deve atualizar as tabelas de ajuda de cada servidor, usando as instruções fornecidas anteriormente.
