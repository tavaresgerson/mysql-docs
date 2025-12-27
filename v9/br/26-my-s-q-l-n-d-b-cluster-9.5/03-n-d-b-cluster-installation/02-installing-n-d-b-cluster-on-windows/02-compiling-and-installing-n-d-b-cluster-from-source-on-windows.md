#### 25.3.2.2 Compilando e Instalando o NDB Cluster a partir da Fonte no Windows

A Oracle fornece binários pré-compilados do NDB Cluster para Windows, que devem ser adequados para a maioria dos usuários. No entanto, se desejar, também é possível compilar o NDB Cluster para Windows a partir do código-fonte. O procedimento para fazer isso é quase idêntico ao usado para compilar os binários padrão do Servidor MySQL para Windows, e utiliza as mesmas ferramentas. No entanto, há duas diferenças principais:

* O MySQL NDB Cluster 9.5 é construído a partir das fontes do MySQL Server 9.5, disponíveis na página de downloads do MySQL em <https://dev.mysql.com/downloads/>. O arquivo de fonte arquivado deve ter um nome semelhante a `mysql-9.4.0.tar.gz`. Você também pode obter as fontes do GitHub em <https://github.com/mysql/mysql-server>.

* Você deve configurar a compilação usando a opção `WITH_NDB` além de quaisquer outras opções de compilação que você desejar usar com **CMake**. `WITH_NDBCLUSTER` também é suportado para compatibilidade reversa, mas é desatualizado e sujeito à remoção futura.

Importante

A opção `WITH_NDB_JAVA` está habilitada por padrão. Isso significa que, por padrão, se o **CMake** não conseguir encontrar a localização do Java no seu sistema, o processo de configuração falha; se você não deseja habilitar o suporte ao Java e ao ClusterJ, você deve indicar isso explicitamente configurando a compilação usando `-DWITH_NDB_JAVA=OFF`. (Bug #12379735) Use `WITH_CLASSPATH` para fornecer o caminho de classe do Java, se necessário.

Para mais informações sobre as opções **CMake** específicas para a compilação do NDB Cluster, consulte Opções do CMake para Compilar o NDB Cluster.

Depois que o processo de compilação estiver concluído, você pode criar um arquivo Zip contendo os binários compilados; a Seção 2.8.4, “Instalando o MySQL usando uma distribuição de fonte padrão”, fornece os comandos necessários para realizar essa tarefa em sistemas Windows. Os binários do NDB Cluster podem ser encontrados no diretório `bin` do arquivo resultante, que é equivalente ao arquivo `no-install`, e que pode ser instalado e configurado da mesma maneira. Para mais informações, consulte a Seção 25.3.2.1, “Instalando o NDB Cluster no Windows a partir de uma versão binária”.