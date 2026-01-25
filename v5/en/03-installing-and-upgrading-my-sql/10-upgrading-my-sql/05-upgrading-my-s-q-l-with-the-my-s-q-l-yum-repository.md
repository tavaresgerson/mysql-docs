### 2.10.5 Atualizando o MySQL com o MySQL Yum Repository

Para plataformas suportadas baseadas em Yum (consulte a Seção 2.5.1, “Instalando o MySQL no Linux Usando o MySQL Yum Repository”, para uma lista), você pode realizar um upgrade *in-place* para o MySQL (ou seja, substituindo a versão antiga e, em seguida, executando a nova versão usando os arquivos de dados antigos) com o MySQL Yum Repository.

Notas

* Antes de realizar qualquer update no MySQL, siga cuidadosamente as instruções na Seção 2.10, “Atualizando o MySQL”. Entre outras instruções discutidas lá, é especialmente importante fazer o backup do seu Database antes do update.

* As instruções a seguir pressupõem que você instalou o MySQL com o MySQL Yum Repository ou com um Package RPM baixado diretamente da [página de Download do MySQL na MySQL Developer Zone](https://dev.mysql.com/downloads/); se não for esse o caso, siga as instruções na Seção 2.5.2, “Substituindo uma Distribuição de Terceiros do MySQL Usando o MySQL Yum Repository”.

1. #### Selecionando uma Série de Destino

   Por padrão, o MySQL Yum Repository atualiza o MySQL para a versão mais recente na série de release que você escolheu durante a instalação (consulte Selecionando uma Série de Release para detalhes), o que significa, por exemplo, que uma instalação 5.6.x *não* é atualizada para um release 5.7.x automaticamente. Para atualizar para outra série de release, você precisa primeiro desabilitar o sub-repository para a série que foi selecionada (por padrão ou por você mesmo) e habilitar o sub-repository para sua série de destino. Para fazer isso, consulte as instruções gerais fornecidas em Selecionando uma Série de Release. Para fazer o upgrade do MySQL 5.6 para 5.7, execute o *inverso* das etapas ilustradas em Selecionando uma Série de Release, desabilitando o sub-repository para a série MySQL 5.6 e habilitando o para a série MySQL 5.7.

   Como regra geral, para fazer o upgrade de uma série de release para outra, avance para a próxima série em vez de pular uma série. Por exemplo, se você estiver executando o MySQL 5.5 e desejar atualizar para 5.7, faça o upgrade para o MySQL 5.6 primeiro antes de atualizar para o 5.7.

   Importante

   Para obter informações importantes sobre como fazer o upgrade do MySQL 5.6 para 5.7, consulte Upgrading from MySQL 5.6 to 5.7.

2. #### Fazendo o Upgrade do MySQL

   Atualize o MySQL e seus componentes usando o seguinte comando, para plataformas que não possuem dnf habilitado:

   ```sql
   sudo yum update mysql-server
   ```

   Para plataformas que possuem dnf habilitado:

   ```sql
   sudo dnf upgrade mysql-server
   ```

   Alternativamente, você pode atualizar o MySQL pedindo ao Yum para atualizar tudo em seu sistema, o que pode levar consideravelmente mais tempo. Para plataformas que não possuem dnf habilitado:

   ```sql
   sudo yum update
   ```

   Para plataformas que possuem dnf habilitado:

   ```sql
   sudo dnf upgrade
   ```

3. #### Reiniciando o MySQL

   O MySQL Server sempre reinicia após um update pelo Yum. Assim que o Server reiniciar, execute **mysql_upgrade** para verificar e possivelmente resolver quaisquer incompatibilidades entre os dados antigos e o software atualizado. O **mysql_upgrade** também executa outras funções; consulte a Seção 4.4.7, “mysql_upgrade — Verificando e Atualizando Tabelas MySQL” para detalhes.

Você também pode atualizar apenas um componente específico. Use o seguinte comando para listar todos os packages instalados para os componentes do MySQL (para sistemas com dnf habilitado, substitua **yum** no comando por **dnf**):

```sql
sudo yum list installed | grep "^mysql"
```

Após identificar o nome do package do componente de sua escolha, atualize o package com o seguinte comando, substituindo *`package-name`* pelo nome do package. Para plataformas que não possuem dnf habilitado:

```sql
sudo yum update package-name
```

Para plataformas com dnf habilitado:

```sql
sudo dnf upgrade package-name
```

#### Fazendo Upgrade das Shared Client Libraries

Após atualizar o MySQL usando o Yum Repository, aplicativos compilados com versões mais antigas das shared client libraries devem continuar funcionando.

*Se você recompilar aplicativos e vinculá-los dinamicamente com as libraries atualizadas:* Como é típico em novas versões de shared libraries, onde há diferenças ou adições no versionamento de símbolos entre as libraries mais recentes e as mais antigas (por exemplo, entre as shared client libraries mais recentes e padrão 5.7 e algumas versões mais antigas—anteriores ou variantes—das shared libraries fornecidas nativamente pelos repositórios de software das distribuições Linux, ou de outras fontes), quaisquer aplicativos compilados usando as shared libraries atualizadas e mais recentes exigirão essas libraries atualizadas nos sistemas onde os aplicativos são implantados. Se essas libraries não estiverem em vigor, os aplicativos que exigem as shared libraries falharão. Por esta razão, certifique-se de implantar os packages para as shared libraries do MySQL nesses sistemas. Para fazer isso, adicione o MySQL Yum Repository aos sistemas (consulte Adicionando o MySQL Yum Repository) e instale as shared libraries mais recentes usando as instruções fornecidas em Instalando Produtos e Componentes MySQL Adicionais com Yum.
