#### 7.6.7.2 Clonagem de dados localmente

O plugin de clone suporta a seguinte sintaxe para clonar dados localmente; isto é, clonar dados do diretório de dados MySQL local para outro diretório no mesmo servidor ou nó onde a instância do servidor MySQL é executada:

```
CLONE LOCAL DATA DIRECTORY [=] 'clone_dir';
```

Para usar a sintaxe `CLONE`, o plugin clone deve ser instalado. Para instruções de instalação, veja Seção 7.6.7.1, Instalar o Plugin Clone.

O privilégio `BACKUP_ADMIN` é necessário para executar instruções `CLONE LOCAL DATA DIRECTORY`.

```
mysql> GRANT BACKUP_ADMIN ON *.* TO 'clone_user';
```

onde `clone_user` é o usuário do MySQL que executa a operação de clonagem. O usuário que você seleciona para executar a operação de clonagem pode ser qualquer usuário do MySQL com o privilégio `BACKUP_ADMIN` em \*. \*.

O exemplo a seguir demonstra os dados de clonagem localmente:

```
mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/clone_dir';
```

onde `/path/to/clone_dir` é o caminho completo do diretório local para o qual os dados são clonados. É necessário um caminho absoluto, e o diretório especificado (`clone_dir`) não deve existir, mas o caminho especificado deve ser um caminho existente. O servidor MySQL deve ter o acesso de gravação necessário para criar o diretório.

::: info Note

Uma operação de clonagem local não suporta a clonagem de tabelas criadas pelo usuário ou tablespaces que residem fora do diretório de dados. Tentando clonar tais tabelas ou tablespaces causa o seguinte erro: ERRO 1086 (HY000): O arquivo '`/path/to/tablespace_name.ibd`' já existe. Clonar um tablespace com o mesmo caminho que o tablespace de origem causaria um conflito e, portanto, é proibido.

Todas as outras tabelas e espaços de tabelas criados pelo usuário, o espaço de tabelas do sistema, os registros de redirecionamento e os espaços de tabelas de desativação são clonados para o diretório especificado.

:::

Se desejado, você pode iniciar o servidor MySQL no diretório clonado depois que a operação de clonagem for concluída.

```
$> mysqld_safe --datadir=clone_dir
```

onde `clone_dir` é o diretório no qual os dados foram clonados.

Para obter informações sobre a monitorização do estado e progresso das operações de clonagem, ver secção 7.6.7.10, "Monitorização das operações de clonagem".
