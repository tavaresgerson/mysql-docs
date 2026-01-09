#### 25.3.1.4 Construindo um Clúster NDB a partir do Código-Fonte no Linux

Esta seção fornece informações sobre a compilação do Clúster NDB no Linux e em outras plataformas Unix-like. Construir o Clúster NDB a partir do código-fonte é semelhante à construção do Servidor MySQL padrão, embora difira em alguns aspectos-chave discutidos aqui. Para informações gerais sobre a construção do MySQL a partir do código-fonte, consulte a Seção 2.8, “Instalando o MySQL a partir do Código-Fonte”. Para informações sobre a compilação do Clúster NDB em plataformas Windows, consulte a Seção 25.3.2.2, “Compilação e Instalação do Clúster NDB a partir do Código-Fonte em Windows”.

O MySQL NDB Cluster 9.5 é construído a partir das fontes do MySQL Server 9.5, disponíveis na página de downloads do MySQL em <https://dev.mysql.com/downloads/>. O arquivo de código-fonte arquivado deve ter um nome semelhante a `mysql-9.4.0.tar.gz`. Você também pode obter as fontes no GitHub em <https://github.com/mysql/mysql-server>.

A opção `WITH_NDB` para **CMake** faz com que os binários para os nós de gerenciamento, nós de dados e outros programas do Clúster NDB sejam compilados; também faz com que o **mysqld** seja compilado com suporte ao mecanismo de armazenamento `NDB`. Esta opção é necessária ao construir o Clúster NDB.

Importante

A opção `WITH_NDB_JAVA` está habilitada por padrão. Isso significa que, por padrão, se o **CMake** não conseguir encontrar a localização do Java no seu sistema, o processo de configuração falha; se você não deseja habilitar o suporte ao Java e ao ClusterJ, deve indicar isso explicitamente configurando a compilação usando `-DWITH_NDB_JAVA=OFF`. Use `WITH_CLASSPATH` para fornecer o caminho de classe do Java, se necessário.

Para mais informações sobre as opções **CMake** específicas para a construção do Clúster NDB, consulte Opções do CMake para Compilação do Clúster NDB.

Após executar **make && make install** (ou o equivalente do seu sistema), o resultado é semelhante ao obtido ao descompactar um binário pré-compilado na mesma localização.

**Nodos de gerenciamento.** Ao compilar a partir da fonte e executar o **make install** padrão, os binários do servidor de gerenciamento e do cliente de gerenciamento (**ndb_mgmd** e **ndb_mgm**) podem ser encontrados em `/usr/local/mysql/bin`. Apenas o **ndb_mgmd** deve estar presente no host do nó de gerenciamento; no entanto, também é uma boa ideia ter o **ndb_mgm** presente na mesma máquina. Nenhum desses executáveis requer uma localização específica no sistema de arquivos da máquina host.

**Nodos de dados.** O único executável necessário em um host de nó de dados é o binário do nó de dados **ndbd** ou **ndbmtd**"). (O **mysqld**, por exemplo, não precisa estar presente na máquina host.) Por padrão, ao compilar a partir da fonte, este arquivo é colocado no diretório `/usr/local/mysql/bin`. Para a instalação em múltiplos hosts de nó de dados, apenas **ndbd** ou **ndbmtd**") precisam ser copiados para a(s) outra(s) máquina(s) host. (Isso assume que todos os hosts de nó de dados usam a mesma arquitetura e sistema operacional; caso contrário, você pode precisar compilar separadamente para cada plataforma diferente.) O binário do nó de dados não precisa estar em uma localização específica no sistema de arquivos da máquina host, desde que a localização seja conhecida.

Ao compilar o NDB Cluster a partir da fonte, não são necessárias opções especiais para a compilação de binários de nó de dados multithread. Configurar a compilação com suporte ao motor de armazenamento **NDB** faz com que o **ndbmtd**") seja compilado automaticamente; o **make install** coloca o binário **ndbmtd**") no diretório `bin` da instalação, juntamente com **mysqld**, **ndbd** e **ndb_mgm**.

**Nodos do SQL.** Se você compilar o MySQL com suporte a clustering e realizar a instalação padrão (usando **make install** como usuário `root` do sistema), o **mysqld** é colocado em `/usr/local/mysql/bin`. Siga os passos descritos na Seção 2.8, “Instalando o MySQL a partir da fonte”, para preparar o **mysqld** para uso. Se você deseja executar vários nós do SQL, pode usar uma cópia do mesmo executável **mysqld** e seus arquivos de suporte associados em várias máquinas. A maneira mais fácil de fazer isso é copiar todo o diretório `/usr/local/mysql` e todos os diretórios e arquivos contidos nele para o(s) host(s) do nó(s) do SQL, e depois repetir os passos da Seção 2.8, “Instalando o MySQL a partir da fonte”, em cada máquina. Se você configurar a compilação com uma opção `PREFIX` não padrão, você deve ajustar o diretório de acordo.

Na Seção 25.3.3, “Configuração Inicial do NDB Cluster”, criamos arquivos de configuração para todos os nós do nosso exemplo de NDB Cluster.