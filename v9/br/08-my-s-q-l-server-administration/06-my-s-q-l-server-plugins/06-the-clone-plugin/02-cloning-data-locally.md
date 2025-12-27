#### 7.6.6.2 Clonando Dados Localmente

O plugin de clonagem suporta a seguinte sintaxe para clonar dados localmente; ou seja, clonar dados do diretório de dados MySQL local para outro diretório no mesmo servidor ou nó onde a instância do servidor MySQL está em execução:

```
CLONE LOCAL DATA DIRECTORY [=] 'clone_dir';
```

Para usar a sintaxe `CLONE`, o plugin de clonagem deve estar instalado. Para instruções de instalação, consulte a Seção 7.6.6.1, “Instalando o Plugin de Clonagem”.

O privilégio `BACKUP_ADMIN` é necessário para executar as instruções `CLONE LOCAL DATA DIRECTORY`.

```
mysql> GRANT BACKUP_ADMIN ON *.* TO 'clone_user';
```

onde `clone_user` é o usuário MySQL que realiza a operação de clonagem. O usuário que você selecionar para realizar a operação de clonagem pode ser qualquer usuário MySQL com o privilégio `BACKUP_ADMIN` em \*.\*.

O seguinte exemplo demonstra a clonagem de dados localmente:

```
mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/clone_dir';
```

onde `*`/`caminho/para/diretorio_de_clone`* é o caminho completo do diretório local para onde os dados estão sendo clonados. Um caminho absoluto é necessário, e o diretório especificado (“*`diretorio_de_clone`*”) não deve existir, mas o caminho especificado deve ser um caminho existente. O servidor MySQL deve ter o acesso de escrita necessário para criar o diretório.

Observação

Uma operação de clonagem local não suporta a clonagem de tabelas ou espaços de tabelas criados pelo usuário que residem fora do diretório de dados. Se tentar clonar tais tabelas ou espaços de tabelas, o seguinte erro será exibido: ERRO 1086 (HY000): O arquivo `*`/`caminho/para/tablespace_name.ibd`* já existe. A clonagem de um espaço de tabelas com o mesmo caminho do espaço de tabelas de origem causaria um conflito e, portanto, é proibida.

Todas as outras tabelas `InnoDB` e espaços de tabelas criados pelo usuário, o espaço de tabelas do sistema `InnoDB`, os logs de redo e os espaços de tabelas undo são clonados para o diretório especificado.

Se desejar, você pode iniciar o servidor MySQL no diretório clonado após a operação de clonagem estar concluída.

```
$> mysqld_safe --datadir=clone_dir
```

onde *`clone_dir`* é o diretório para onde os dados foram clonados.

Para obter informações sobre o monitoramento do status e do progresso da operação de clonagem, consulte a Seção 7.6.6.10, “Monitoramento de Operações de Clonagem”.