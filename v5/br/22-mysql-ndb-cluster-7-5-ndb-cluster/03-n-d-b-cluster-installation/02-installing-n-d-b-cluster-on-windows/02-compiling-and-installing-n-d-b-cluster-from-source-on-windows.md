#### 21.3.2.2 Compilar e instalar o NDB Cluster a partir da fonte no Windows

A Oracle fornece binários pré-compilados do NDB Cluster para Windows, que devem ser adequados para a maioria dos usuários. No entanto, se desejar, também é possível compilar o NDB Cluster para Windows a partir do código-fonte. O procedimento para fazer isso é quase idêntico ao usado para compilar os binários padrão do MySQL Server para Windows, e utiliza as mesmas ferramentas. No entanto, há duas diferenças principais:

- Para construir o NDB Cluster, é necessário usar as fontes do NDB Cluster. Elas estão disponíveis na página de downloads do NDB Cluster em <https://dev.mysql.com/downloads/cluster/>. O arquivo de fonte arquivado deve ter um nome semelhante a `mysql-cluster-gpl-7.6.35.tar.gz`. Você também pode obter as fontes do NDB Cluster no GitHub em <https://github.com/mysql/mysql-server/tree/cluster-7.5> (NDB 7.5) e <https://github.com/mysql/mysql-server/tree/cluster-7.6> (NDB 7.6). *A construção do NDB Cluster 7.5 ou 7.6 a partir das fontes padrão do MySQL Server 5.7 não é suportada*.

- Você deve configurar a compilação usando a opção `WITH_NDBCLUSTER`, além de quaisquer outras opções de compilação que você desejar usar com o **CMake**. (`WITH_NDBCLUSTER_STORAGE_ENGINE` é suportado como um alias.)

Importante

A opção `WITH_NDB_JAVA` está habilitada por padrão. Isso significa que, por padrão, se o **CMake** não conseguir encontrar a localização do Java no seu sistema, o processo de configuração falha; se você não deseja habilitar o suporte ao Java e ao ClusterJ, deve indicar isso explicitamente configurando a compilação usando `-DWITH_NDB_JAVA=OFF`. (Bug #12379735) Use `WITH_CLASSPATH` para fornecer o caminho de classe do Java, se necessário.

Para obter mais informações sobre as opções do **CMake** específicas para a construção do NDB Cluster, consulte Opções do CMake para Compilar o NDB Cluster.

Depois que o processo de compilação estiver concluído, você pode criar um arquivo Zip contendo os binários compilados; Seção 2.8.4, “Instalando o MySQL usando uma distribuição de fonte padrão” fornece os comandos necessários para realizar essa tarefa em sistemas Windows. Os binários do NDB Cluster podem ser encontrados no diretório `bin` do arquivo resultante, que é equivalente ao arquivo `no-install`, e que pode ser instalado e configurado da mesma maneira. Para mais informações, consulte Seção 21.3.2.1, “Instalando o NDB Cluster no Windows a partir de uma versão binária”.
