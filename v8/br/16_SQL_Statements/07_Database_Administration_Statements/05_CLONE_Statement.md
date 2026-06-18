### 15.7.5 Declaração CLONE

```
CLONE clone_action

clone_action: {
    LOCAL DATA DIRECTORY [=] 'clone_dir';
  | INSTANCE FROM 'user'@'host':port
    IDENTIFIED BY 'password'
    [DATA DIRECTORY [=] 'clone_dir']
    [REQUIRE [NO] SSL]
}
```

A declaração `CLONE` é usada para clonar dados localmente ou a partir de uma instância remota do servidor MySQL. Para usar a sintaxe `CLONE`, o plugin de clonagem deve estar instalado. Veja a Seção 7.6.7, “O Plugin de Clonagem”.

A sintaxe `CLONE LOCAL DATA DIRECTORY` clona dados do diretório de dados MySQL local para um diretório no mesmo servidor ou nó onde a instância do servidor MySQL está em execução. O diretório `'clone_dir'` é o caminho completo do diretório local para onde os dados são clonados. É necessário um caminho absoluto. O diretório especificado não pode existir, mas o caminho especificado deve ser um caminho existente. O servidor MySQL requer o acesso de escrita necessário para criar o diretório especificado. Para mais informações, consulte a Seção 7.6.7.2, “Clonando Dados Localmente”.

A sintaxe `CLONE INSTANCE` clona dados de uma instância remota do servidor MySQL (o doador) e os transfere para a instância MySQL onde a operação de clonagem foi iniciada (o destinatário).

- `user` é o usuário clone na instância do servidor MySQL do doador.

- `host` é o endereço `hostname` da instância do servidor MySQL do doador. O formato de endereço do Protocolo de Internet versão 6 (IPv6) não é suportado. Um alias para o endereço IPv6 pode ser usado em vez disso. Um endereço IPv4 pode ser usado como está.

- `port` é o número `port` da instância do servidor MySQL do doador. (A porta X Protocol especificada por `mysqlx_port` não é suportada. A conexão com a instância do servidor MySQL do doador através do MySQL Router também não é suportada.)

- `IDENTIFIED BY 'password'` especifica a senha do usuário clone na instância do servidor MySQL do doador.

- `DATA DIRECTORY [=] 'clone_dir'` é uma cláusula opcional usada para especificar um diretório no destinatário para os dados que você está clonando. Use esta opção se você não quiser remover dados existentes no diretório de dados do destinatário. É necessário um caminho absoluto e o diretório não pode existir. O servidor MySQL deve ter o acesso de escrita necessário para criar o diretório.

  Quando a cláusula opcional `DATA DIRECTORY [=] 'clone_dir'` não é usada, uma operação de clonagem remove os dados existentes no diretório de dados do destinatário, os substitui pelos dados clonados e reinicia automaticamente o servidor posteriormente.

- `[REQUIRE [NO] SSL]` especifica explicitamente se uma conexão criptografada deve ser usada ou não ao transferir dados clonados pela rede. Um erro é retornado se a especificação explícita não puder ser atendida. Se uma cláusula SSL não for especificada, o clone tenta estabelecer uma conexão criptografada por padrão, revertendo para uma conexão insegura se a tentativa de conexão segura falhar. Uma conexão segura é necessária ao clonar dados criptografados, independentemente de esta cláusula ser especificada. Para mais informações, consulte Configurando uma Conexão Criptografada para Clonagem.

Para obter informações adicionais sobre a clonagem de dados de uma instância remota do servidor MySQL, consulte a Seção 7.6.7.3, “Clonagem de Dados Remotas”.
