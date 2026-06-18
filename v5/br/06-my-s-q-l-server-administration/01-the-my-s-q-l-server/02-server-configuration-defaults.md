### 5.1.2 Configurações Padrão do Servidor

O servidor MySQL tem muitos parâmetros de operação, que você pode alterar ao iniciar o servidor usando opções de linha de comando ou arquivos de configuração (arquivos de opção). Também é possível alterar muitos parâmetros em tempo de execução. Para obter instruções gerais sobre como definir parâmetros ao iniciar ou em tempo de execução, consulte Seção 5.1.6, “Opções de Comando do Servidor” e Seção 5.1.7, “Variáveis do Sistema do Servidor”.

No Windows, o Instalador do MySQL interage com o usuário e cria um arquivo chamado `my.ini` no diretório de instalação padrão como o arquivo de arquivo de opção padrão. Se você instalar no Windows a partir de um arquivo ZIP, pode copiar o arquivo de modelo `my-default.ini` no diretório de instalação padrão para `my.ini` e usar este último como o arquivo de opção padrão.

Nota

A partir do MySQL 5.7.18, o `my-default.ini` não está mais incluído ou instalado pelos pacotes de distribuição.

Nota

No Windows, a extensão de arquivo `.ini` ou `.cnf` pode não ser exibida.

Após concluir o processo de instalação, você pode editar o arquivo de opção padrão a qualquer momento para modificar os parâmetros usados pelo servidor. Por exemplo, para usar um ajuste de parâmetro no arquivo que está comentado com um caractere `#` no início da linha, remova o `#` e modifique o valor do parâmetro, se necessário. Para desabilitar um ajuste, adicione um `#` no início da linha ou remova-o.

Para plataformas que não são do Windows, nenhum arquivo de opção padrão é criado durante a instalação do servidor ou o processo de inicialização do diretório de dados. Crie seu arquivo de opção seguindo as instruções fornecidas em Seção 4.2.2.2, “Usando Arquivos de Opção”. Sem um arquivo de opção, o servidor começa apenas com suas configurações padrão — veja Seção 5.1.2, “Configurações Padrão de Configuração do Servidor” sobre como verificar essas configurações.

Para obter informações adicionais sobre o formato e a sintaxe do arquivo de opções, consulte Seção 4.2.2.2, “Usando arquivos de opção”.
